# API仕様書

備忘録として

## API機能一覧

| No. | Route | 機能概要 |  
| - | - | - |  
| 0 | /toilet/api | トイレのステータス |
| 1 | /request/api | 備品依頼状況 |  

## データ形式

### /toilet/api

#### GET

| JSON key | 型 | 説明 |  
| - | - | - |  
| status | Number | 0: 空室, 1: 満室 |  

#### POST

| JSON key | 型 | 必須 | 説明 |  
| - | - | - | - |  
| status | Number | ○ | 0: 空室, 1: 満室 |  

---

### /request/api

#### GET

| JSON key | 型 | 説明 |  
| - | - | - |  
| user | String | 依頼者名 |  
| equipment | String | 備品名称 |  
| quantity | Number | 数量（単位は無い） |  
| remarks | String | 備考として |  
| url | String |  |  
| timestamp | Date | 更新日付 |  
| status | Number | 0: 論理削除, 1: 依頼, 2: 発注, 3: 完了, 4: 却下 |  


#### POST

| JSON key | 型 | 必須 | 説明 |  
| - | - | - | - |  
| user | String | × | 依頼者名 |  
| equipment | String | × | 備品名称 |  
| quantity | Number | × | 数量（単位は無い） |  
| remarks | String | × | 備考として |  
| url | String | × |  |  
| status | Number | ○ | 0: 論理削除, 1: 依頼, 2: 発注, 3: 完了, 4: 却下 |  

