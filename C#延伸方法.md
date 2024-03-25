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
    if (self.TryGetComponent(out comp))
        return self;
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