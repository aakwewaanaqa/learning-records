# 延伸方法

## 引言

延伸方法是一個很實用並且能夠直接影響程式碼乾淨度的一個`C#`功能。
由於`C#`本身是物件導向，如果還想要針對`已經完成的類別添加函式`怎麼做呢？要用`延伸方法`！

## 延伸方法建構

延伸方法的類別一定要是`靜態`的，但名稱不重要，只要名稱清楚就好。
另外使用`internal`的意思是只有在相同的`Assembly Definition`也就是`組件`可以使用。
你也可以是`public`但就需要小心不要重複命名了。
```csharp
internal static class Extensions
{
    
}
```

再來加上你要`綁定指定的物件`的函式。
一定只能是`static`函式，然後第一個參數加上`this`。
範例函式`Print`綁定到`string`物件上。
```csharp
internal static class Extensions
{
    public static Print(this string msg)
    {
        Debug.Log(msg);
    }
}
```

如此一來使用的時候就可以更方便。
```csharp
public class SomeComponent : Monobehaviour
{
    private void Start()
    {
        // 像是變魔術一樣，把`Print`綁到`string`上
        // 所有的`string`都可以`Print()`了
        // 物件本身會被當成第一個有`this`的參數傳入
        "你好！".Print();
    }
}
```

## 實用例子

### 一、常用慣例

如果要把`Vector2`整數化怎麼做？
```csharp
public Vector2 Round(Vector2 input)
{
    float x = Mathf.Round(input.x);
    float y = Mathf.Round(input.y);
    return new Vector2(x, y);
}
```

這樣呼叫的時候就必須要丟入`input`
```csharp
Vector2 pos = Round(transform.position);
```

如果改成延伸方法呢？參數加個`this`
```csharp
public Vector2 Round(this Vector2 input)
{
    float x = Mathf.Round(input.x);
    float y = Mathf.Round(input.y);
    return new Vector2(x, y);
}
```

呼叫的時候只需要這樣做：是不是比較好讀呢？
```csharp
Vector2 pos = transform.position.Round();
```

### 二、鏈結方法

常常在創建物件的時候，是不是要一直`gameObject`從頭到尾？
```csharp
var instance = Instantiate(prefab);
var rectTransform = instance.AddComponent<RectTransform>();
instance.AddComponent<CanvasRenderer>();
instance.AddComponent<Image>();

rectTransform.anchoredPosition = Vector3.zero;
image.sprite = sprite;
```

如果我們把`AddComponent`變成`延伸方法`再加上回傳`自己`，就會變得好寫很多。
```csharp
public static GameObject EnsureComponent<T>(this GameObject self, out T comp) where T : Component
{
    if (self.TryGetComponent(out comp)) return self;
    comp = self.AddComponent<T>();
    return self;
}
```

如此一來要加的`Component`都可以一次用一個`gameObject`寫完！
因為每一個函式都是傳回`GameObject`而`EnsureComponent`又綁定`GameObject`之上。
特別的地方是`out`還可以順便幫忙宣告變數，也省略了`var`的麻煩。
```csharp
new GameObject("New Object")
    .EnsureComponent(out RectTransform rectTransform)
    .EnsureComponent(out CanvasRenderer _)
    .EnsureComponent(out Image image);
```

### 三、LINQ 查詢方法

`LINQ`是一個常見的查詢命名空間，也是程式碼裡面常用的查詢程式語言。
以下會實作`已經完成綁定的延伸方法`。
```csharp
using System.Linq; // 使用前先引用

public void OnEnable()
{
    // 宣告
    IEnumerable<string> numbers = new[] { "0", "1", "21", "3", "45", "5" };
    // 挑出長度是 1 的
    IEnumerable<string> shorts = numbers.Where(n => n.Length < 2); // n 就是每一個在 numbers 裡面的各個 string
    // 轉成 int
    IEnumerable<int>    digits = shorts.Select(n => int.Parse(n));  // n 就是每一個在 shorts 裡面的各個 string
}
```
> `IEnumberable<T>`跟`T[]`是差不多的，都可以被`foreach`使用。
> 我們的函數如果用`IEnumerable<T>`去撰寫，會`比較有彈性`，
> 因為很多`複數`的資料傳遞方式都繼承`IEnumerable<T>`。
> 比如說：「`T[]`、`List<T>`、`Dictionary<TKey, TValue>`、`Stack<T>`、`Queue<T>`」
> 都可以被`foreach`使用。

上面的實際案例花了 3 條程式碼完成，我們可以連續呼叫把它變短。
透過換行的方式寫在前面，如此一來很清楚做了甚麼查詢。
```csharp
using System.Linq; // 使用前先引用

public void OnEnable()
{
    List<int> digits = new[] { "0", "1", "21", "3", "45", "5" }
        .Where(n => n.Length < 2)
        .Select(n => int.Parse(n))
        .ToList();

    // 會得到結果 new List<int> { 0, 1, 3, 5 }
}
```

如果再複雜一點還可以查更複雜的資料，比如說資料是`結構`。
```csharp
public struct Person
{
    public string name; // 姓名
    public int    age;  // 年齡
    public string job;  // 職業

    public Person(string name, int age, string job)
    {
        this.name = name;
        this.age  = age;
        this.job  = job;
    }
}

public void OnEnable()
{
    List<Person> persons = new List<Person> 
    {
        new Person("Tom Malachai",      42, "Developer"),    
        new Person("John Anderson",     16, "Art"),    
        new Person("Sunny Malachai",    37, "Programmer"),    
        new Person("Daniel Blacksmith", 27, "Marketing"),    
        new Person("Cinder Malachai",   30, "Marketing"),    
    };
    
    // 找成年人
    var adults    = persons.Where(p => p.age > 18);

    // 找到瑪拉基一家人
    var malechais = persons.Where(p => p.name.Contains("Malachai"));

    // 找到資料裡面第一位姓瑪拉基的
    var youngest  = persons.FirstOrDefault(p => p.name.Contains("Malachai"));
}
```

甚至可以找到特定的`類型`，然後擷取`類型`中特定的`資料`。
以下的程式示範在眾多可以繼承`Graphic`的`Component`中找到`Image`，
然後再擷取其中的`sprite`。
```csharp
public void OnEnable()
{
    var sprites = gameObject
        .GetComponentsInChildren<Graphic>()        // 找所有 Graphic
        .OfType<Image>()                           // 找到 Graphic 中繼承是 Image 的
        .Where(image => image.sprite is not null); // 只篩選 Image.sprite 不是 null 的
        .Select(image => image.sprite)             // 把結果 IEnumerable<Image> 轉成 IEnumerable<Sprite>
        .ToArray();                                // 把結果 IEnumerable<Sprite> 轉成 Sprite[]
}
```