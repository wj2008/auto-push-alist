# auto-push-oss

方便将编译出来的文件上传到alist中

## Inputs

|参数|描述|必填|
|----|----|----|
|`token`|alist的Token|是|
|`upUrl`|alist地址|是|
|`saveDir`|alist保存的路径|是|
|`upDir`|本地要上传的目录|否|
|`upFile`|本地要上传的文件|否|
|`asTask`|是否添加为任务|否|

## Example usage

上传文件夹
```yaml
uses: wj2008/auto-push-alist@v1
with:
  token: ${{secrets.alistToken}}
  upUrl: http://v5.123456.xyz
  saveDir: /public/baiduyun/
  upDir: ./apks
  upFile: ./apk2/abc.apk
  asTask: ture
```