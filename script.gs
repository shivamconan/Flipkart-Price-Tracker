function myTrigger() {
  var ui = SpreadsheetApp.getUi(); 

  var result = ui.prompt(
      'Enter your email address .','Price alerts will be delivered to this mail' ,
      ui.ButtonSet.OK_CANCEL);
  var button = result.getSelectedButton();
  var text = result.getResponseText();
   PropertiesService.getScriptProperties().setProperty('email', text);
  priceCheck();
  ScriptApp.newTrigger("priceCheck")
   .timeBased()
   .everyHour(4)
   .create();
  
}
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Flipkart Price Tracker')
      .addItem('Initialize Price', 'initialize')
      .addSeparator()
      .addItem('Track Price', 'myTrigger')
      .addSeparator()
      .addItem('Help', 'helpDialog')
      .addToUi();
}

function helpDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Index');
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'Help for Flipkart Price Tracker');
}

function initialize()
{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
var refcell = sheet.getRange(26,1);
  for(var j=2;j<=10;j++)
  {
    var url= sheet.getRange(j,1).getValue();
   var test= (url.indexOf("flipkart"));
    var website= test>0?1:2;
     refcell.setValue(url);
    var selection=sheet.getRange(j,1)
    sheet.setActiveSelection(selection);
  if(website==1)
    {
      
      var formula1= '=importXml(A26,'
       formula1=formula1.concat('"/html/body/div")')
      sheet.getRange(j,3).setFormula(formula1); 
      var received= sheet.getRange(j,3).getValue();
      Logger.log(received);
      var n= (received.indexOf("Reviews"))+8;
      var price="";
      while (1) {
         var symbol= received[n];  
         var chek=isNaN(symbol);
         if(chek)
             {
              if(symbol==",")
                {
                  price=price+symbol;
                  n++;
                  continue;
                 }
               break;
              }
         else{
    
              price=price+symbol;
              n++;
             }
        } }
   else if(website==2)
     {
       var formula1= '=importXml(A26,'
      // formula1= formula1.concat("//span[contains(@class, 'currencyINR')])")
       formula1=formula1.concat('"/html/body/option")')
      sheet.getRange(j,3).setFormula(formula1); 
      var received= sheet.getRange(j,3).getValue();
      var price="";
      while (1) {
         var symbol= received[n];  
         var chek=isNaN(symbol);
         if(chek)
             {
              if(symbol==",")
                {
                  price=price+symbol;
                  n++;
                  continue;
                 }
               break;
              }
         else{
    
              price=price+symbol;
              n++;
             }
        }
      }
    
sheet.getRange(j,3).setValue(price);
  }
}
function priceCheck()
{
  //showPrompt();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var refcell = sheet.getRange(26,1);
  for(var j=2;j<=5;j++)
  {
   refcell.setValue(sheet.getRange(j,1).getValue()); 
  sheet.getRange(j,15).setFormula('=importXml(A26,"/html/body/div")'); 
  var received= sheet.getRange(j,15).getValue();
    var n= (received.indexOf("Reviews"))+8;
   var price="";
  while (1) {
   
  var symbol= received[n];  
  
  
    var chek=isNaN(symbol);
    if(chek)
    {
      if(symbol==",")
      {
        price=price+symbol;
        n++;
        continue;
       }
      break;
    }
    else{
    
  price=price+symbol;
    n++;
  }
  }
  price=parseInt(price); 

  var lastPrice=sheet.getRange(j,3).getValue();
    lastPrice=parseInt(lastPrice);
     Logger.log(lastPrice);
   var link=  sheet.getRange(j,1).getValue();
    //var mail = PropertiesService.getScriptProperties().getProperty('email');
    Logger.log(price);
   
    if (price>lastPrice)
    {
 MailApp.sendEmail({
     to: PropertiesService.getScriptProperties().getProperty('email'),
  
   subject: "Price of this product has been lowered!",
   
   htmlBody: "<a href='" + link + "'>Link to the product</a>",

 });
    }
    //sheet.getRange(j,5).setValue(price);
  
  }
}

function deleteTrigger() {
  // Loop over all triggers and delete them
  var allTriggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < allTriggers.length; i++) {
    ScriptApp.deleteTrigger(allTriggers[i]);
  }
}
