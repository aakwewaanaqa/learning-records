# Excel 與 Json 資料研究

讀取資料一直是伺服器一個很重要的功能，有一些靜態的網站也會用來查詢資料。

- 使用`C#` 
- 使用`async Task`非同步 
- 不能在`Unity`上使用
- 要使用`nuget`加入插件

> 非同步`async`補充<br/>
> https://toyo0103.github.io/2020/09/19/about_async/

> `nuget`補充<br/>
> https://learn.microsoft.com/zh-tw/nuget/quickstart/install-and-use-a-package-in-visual-studio

## C# 讀取 Excel
### Nuget : ExcelDataReader、ExcelDataReader.DataSet

兩個包要一起裝吼！你不想要裝第二個其實也可以，但那個比較進階。<br/>
目前研究的基礎，用`ExcelDataReader`、`ExcelDataReader.DataSet`讀取檔案，非常方便！<br/>
甚至`Excel`檔案內部其實是可以用運算式喔！不需要變成`string`沒差！<br/>
使用`ExcelReaderFactory`製作一個讀取器`CreateReader(file)`<br/>

```csharp
await using var file   = File.OpenRead("[檔案].xlsx");
using var       reader = ExcelReaderFactory.CreateReader(file);
```

> `using`的意義<br/>
> 使用`using`宣告一個可以事後丟棄`IDisposable`的物件，會在離開函式之後釋放記憶體<br/>
> 如此一來可以避免記憶體浪費<br/>
> https://learn.microsoft.com/zh-tw/dotnet/csharp/language-reference/statements/using

假設你的表格只有一張表，沒有多重表的話，可以直接開始讀入檔案了。

```csharp
using var table = reader.AsDataSet(configuration).Tables[0];
```