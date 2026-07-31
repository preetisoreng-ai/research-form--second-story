/**
 * Google Apps Script for "Second Story — Preworn Fashion Survey"
 * Google Sheet: https://docs.google.com/spreadsheets/d/1QhQ6IO5H2UdFEEOfExGKB59g01b6HsY9nVccnVIFMIs/edit
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet (https://docs.google.com/spreadsheets/d/1QhQ6IO5H2UdFEEOfExGKB59g01b6HsY9nVccnVIFMIs/edit).
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Replace all code in the editor with this script.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone".
 * 8. Click "Deploy" and copy your Web App URL.
 * 9. (Optional) Paste your Web App URL into script.js under `GOOGLE_APPS_SCRIPT_URL`.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var row = [
      new Date(),
      data.gender || '',
      data.age || '',
      data.occupation || '',
      data.area || '',
      data.monthlySpend || '',
      data.shoppingFreq || '',
      Array.isArray(data.shoppingStores) ? data.shoppingStores.join(', ') : (data.shoppingStores || ''),
      data.luxuryPurchase || '',
      Array.isArray(data.unusedClothes) ? data.unusedClothes.join(', ') : (data.unusedClothes || ''),
      data.everSold || '',
      Array.isArray(data.reasonsToSell) ? data.reasonsToSell.join(', ') : (data.reasonsToSell || ''),
      Array.isArray(data.barriersToSell) ? data.barriersToSell.join(', ') : (data.barriersToSell || ''),
      Array.isArray(data.buyingComfort) ? data.buyingComfort.join(', ') : (data.buyingComfort || ''),
      Array.isArray(data.mattersMost) ? data.mattersMost.join(', ') : (data.mattersMost || ''),
      data.preferredModel || '',
      data.trustFeedback || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", rowInserted: row }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
