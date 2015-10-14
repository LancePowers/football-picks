#Poolhost Pick'Em Automated

## Get nfl stats
 - complete! Information from nfl outsiders brought into a json object
 Should save to db

## Decide Picks

### Get schedule from poolhost

## Submit Picks

### Post Request format
#### Request headers
```
POST //index.asp?page=savpicks.asp HTTP/1.1
Host: www.poolhost.com
Connection: keep-alive
Content-Length: 382
Cache-Control: max-age=0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Origin: http://www.poolhost.com
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Referer: http://www.poolhost.com//index.asp?page=picks.asp
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.8
Cookie: __qca=P0-1748476057-1441925589859; __gads=ID=6f29cb81aca67ac7:T=1441929230:S=ALNI_MYzZkPLkJx9YTpg_q5jkfDXk9I8dg; ASPSESSIONIDQADRSCAC=CDKGGBOBDDGFENDHPMEJMENF; UsernameCookie=TheShuff; PasswordCookie=dr2al56; RememberMeCookie=1; server%5Fnum=0; _gat=1; _ga=GA1.2.1440465581.1441925592
```
- query params
```
page=savpicks.asp
```
- Form data 
```
4619_wt=11&4619=21&4620_wt=13&4620=16&4621_wt=1&4621=4&4622_wt=15&4622=1&4623_wt=2&4623=10&4624_wt=4&4624=19&4625_wt=3&4625=11&4626_wt=10&4626=32&4627_wt=14&4627=24&4628_wt=7&4628=29&4629_wt=8&4629=17&4630_wt=9&4630=9&4631_wt=6&4631=15&4632=5&4632_wt=16&4633_wt=5&4633=23&4618=26&4618_wt=12&SpreadType=1&RollingDL=True&PreSeason=0&UseWeights=True&week=7&pid=825505&action=Save+Picks
```


#### CURL
```
curl 'http://www.poolhost.com//index.asp?page=savpicks.asp' -H 'Cookie: __qca=P0-1748476057-1441925589859; __gads=ID=6f29cb81aca67ac7:T=1441929230:S=ALNI_MYzZkPLkJx9YTpg_q5jkfDXk9I8dg; ASPSESSIONIDQACSRAAD=PHPLJLNDOGPLEJLCJONMHBMA; RememberMeCookie=1; PasswordCookie=dr2al56; UsernameCookie=TheShuff; server%5Fnum=0; _gat=1; _ga=GA1.2.1440465581.1441925592' -H 'Origin: http://www.poolhost.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: http://www.poolhost.com//index.asp?page=picks.asp' -H 'Connection: keep-alive' --data '4619=18&4619_wt=6&4620=6&4620_wt=2&4621_wt=3&4621=4&4622=3&4622_wt=9&4623_wt=15&4623=10&4624_wt=11&4624=19&4625_wt=10&4625=11&4626_wt=5&4626=32&4627_wt=4&4627=24&4628=13&4628_wt=8&4629_wt=13&4629=17&4630=2&4630_wt=1&4631_wt=14&4631=15&4632=5&4632_wt=16&4633_wt=7&4633=23&4618=26&4618_wt=12&SpreadType=1&RollingDL=True&PreSeason=0&UseWeights=True&week=7&pid=825505&action=Save+Picks' --compressed
```




## AI adjust Logic

MVP

Sign up
Profile
Super Easy to make a friend


MVP - 



[old/young, bold/timid, blue/green];
engagement(clicks)

[000] <--- 100 clicks
[100] <--- 50 clicks
[110]
[111]
[010]
[011]
[001]
[101]



Setup cool activities
create fb marketing
find volunteers
creating 'event' 
match groups of 4
Group challenges
Capable of holding a Suite of Games
Trivia
Carry points
Use interest and would you rather games to see if we have evidence of good matches 
Win? <--- venture
Competitive with other groups

var people = [{
keywords
name
day/time
}]