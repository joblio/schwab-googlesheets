function updateDaily(force = false) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Daily');
  let today = Utilities.formatDate(new Date(), 'America/New_York', 'M/d/yyyy');
  if (!force && todayIsDone(sheet, today)) return;
  let newLine = [today];
  newLine.push(getTotalFromSheet('Roth IRA'));
  newLine.push(getTotalFromSheet('Cash Acct'));
  newLine.push(getTotalFromSheet('IRA Acct'));
  newLine.push(getTotalFromSheet('HSA'));
  newLine.push('=SUM(INDIRECT("B"&ROW()&":E"&ROW()))');
  if (newLine[0] == 0 || newLine[0] == undefined || newLine[0] == '') {
    emailJoelError();
  } else {
    sheet.appendRow(newLine);
  }
}

function todayIsDone(sheet, today) {
  let data =  sheet.getRange('A:A').getDisplayValues();
  let lastLine = data[data.length-1][0];
  return (today == lastLine) ? true : false;
}

function getTotalFromSheet(sheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getRange('D5').getValue()*1;

}

function forceUpdateDaily() {
  updateFormulasOnAllSheets();
  SpreadsheetApp.flush();
  Utilities.sleep(10);
  updateDaily(true);
}