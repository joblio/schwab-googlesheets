
function GET_SCHWAB_POSITIONS(unencryptedAccountNumber) {
  const encryptedAccountNumber = getEncryptedAccountNumber(unencryptedAccountNumber);
  if (encryptedAccountNumber == null) return "Account number not found "+unencryptedAccountNumber;
  var extraOptions = "?fields=positions";
    let json = fetchSchwabData('accounts/'+encryptedAccountNumber, extraOptions);
  var positions = json["securitiesAccount"]["positions"];
  const cashAmount = json.securitiesAccount.currentBalances.cashBalance;

  var array = [];
  let tickers = [];
  let totalValue = cashAmount;
  if (positions) {
    for (position of positions) {
        let item = [];
        item[0] = (position.instrument["symbol"] == 'BRK.B') ? 'BRK/B' : position.instrument["symbol"];
        if (item[0] == 'CHMR') continue;
        item[1] = position.longQuantity;
        item[2] = position.averagePrice;
        item[3] = ''; // Div Yield
        item[4] = ''; // Today's price
        item[5] = ''; // Day change
        item[6] = ''; // Day change %
        item[7] = position.marketValue;
        item[8] = ''; // Percent of portfolio
        array.push(item);
        tickers.push(item[0]);
        totalValue = totalValue + position.marketValue;
    }
    const tickerString = tickers.join(',')
    const marketData = fetchMarketData('quotes','?symbols='+tickerString+'&fields=quote,fundamental&indicative=false');
    //   console.log(marketData);
    for (item of array) {
        // if (item[0] == 'Cash') continue;
        try {
        let data = marketData[item[0]];
        item[3] = data.fundamental.divYield/100;
        item[4] = data.quote.lastPrice;
        item[5] = data.quote.netChange;
        item[6] = data.quote.netPercentChange/100;
        item[8] = (item[7]/totalValue);
        } catch (err) {
        console.log('Error when processing '+item[0]);
        console.log(marketData);
        }    
    }
    array.sort(function(b, a) {
        // Sorted by currentDayProfitLossPercentage
        return a[7] - b[7];
    });
  }
  array.unshift(['Cash', new Date(),'','','','','',cashAmount,cashAmount/totalValue]);
  return array;
}

function GET_SCHWAB_CASH_BALANCE(unencryptedAccountNumber) {}


// function testMarketData() {
//   const tickerString = 'BRK/B';
//   const marketData = fetchMarketData('quotes','?symbols='+tickerString+'&fields=quote,fundamental&indicative=false');
//   console.log(marketData);

// }

function getEncryptedAccountNumber(unencryptedAccountNumber) {
  let json = fetchSchwabData('accounts/accountNumbers');
  // console.log(json);
  if (!unencryptedAccountNumber) return json;
  unencryptedAccountNumber = typeof unencryptedAccountNumber === 'number' ? String(unencryptedAccountNumber) : unencryptedAccountNumber;
  const account = json.find(acc => acc.accountNumber === unencryptedAccountNumber);
  return account ? account.hashValue : null; // Return hashValue or null if not found
}

// function fetchSchwabAccountsData() {
//   var json = fetchSchwabData('accounts/', "?fields=positions")
//   return json;
// }

function fetchSchwabData(endpoint, extraOptions = '') {
  var authorization = schwab_GetBearerString();
  var options = {
    "method" : "GET",
    "headers" :  {"Authorization" : authorization},
  };
  // var extraOptions = "?fields=positions";
  // endpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';

  var myUrl =
    "https://api.schwabapi.com/trader/v1/" + endpoint +  extraOptions;
  // console.log(myUrl);
  var result = UrlFetchApp.fetch(myUrl, options);

  //Parse JSON
  var contents = result.getContentText();
  // console.log(contents);
  var json = JSON.parse(contents);
  return json;
}

function fetchMarketData(endpoint, extraOptions = '') {
  var authorization = schwab_GetBearerString();
  var options = {
    "method" : "GET",
    "headers" :  {"Authorization" : authorization},
    "muteHttpExceptions": true
  };
  // var extraOptions = "?fields=positions";
  // endpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';
  var myUrl =
    "https://api.schwabapi.com/marketdata/v1/" + endpoint +  extraOptions;
  // console.log(myUrl);
  var result = UrlFetchApp.fetch(myUrl, options);
  
  //Parse JSON
  var contents = result.getContentText();
  // console.log(contents);
  var json = JSON.parse(contents);
  return json;
}




function saveSchwabDataToGDrive() {
  const folder = DriveApp.getFolderById('0B4yrllU2r2JSOGFjYTRhMWItODc0Yi00Y2FiLTgzNWUtZTg0YjBiOTNmZjIy');
  const str = JSON.stringify(fetchSchwabAccountsData(),null,2);
  const blob = Utilities.newBlob(str);
  blob.setName('Latest Schwab Data.txt');
  blob.setContentTypeFromExtension();
  folder.createFile(blob);
  return;
}

