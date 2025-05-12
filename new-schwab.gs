// This can't be run during onOpen because fetch can't be called
function updateAllSheets() {
  const SHEET_NAMES = [
    'Roth IRA',
    'IRA Acct',
    'Cash Acct',
    'HSA'
  ];
  const ACCT_NUMBER_CELL = 'D2';
  const EMPTY_LINE = ['','','','','','','','',''];

  for (sheetName of SHEET_NAMES) {
    const thisSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const accountNumber = thisSheet.getRange(ACCT_NUMBER_CELL).getDisplayValue();
    let outputArray = GET_SCHWAB_POSITIONS(accountNumber);
    outputArray.push(EMPTY_LINE);
    outputArray.push(EMPTY_LINE);
    const sheetOutputRange = thisSheet.getRange(8,2,outputArray.length,outputArray[0].length);
    sheetOutputRange.setValues(outputArray);
  }
}


function updateFormulasOnAllSheets() {
  const SHEET_NAMES = [
    'Roth IRA',
    'IRA Acct',
    'Cash Acct',
    'HSA'
  ];
  const FORMULA_CELL = 'B8';
  const DAY_NUM = new Date().getDate();
  const FORMULA = '=GET_SCHWAB_POSITIONS(D2,'+DAY_NUM+')';

  for (sheetName of SHEET_NAMES) {
    const thisSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    thisSheet.getRange(FORMULA_CELL).setFormula(FORMULA);
  }
}