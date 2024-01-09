# auto-push-oss

方便将编译出来的文件上传到alist中

## Inputs

|参数|描述|
|----|----|
|`username`|alist的用户名|
|`password`|alist的密码|
|`upUrl`|alist地址|
|`saveDir`|alist保存的路径|
|`upDir`|本地要上传的目录|

## Example usage

```yaml
uses: wj2008/auto-push-alist@master
with:
  username: ${{secrets.alistName}}
  password: ${{secrets.alistPasswd}}
  upUrl: http://v5.123456.xyz
  saveDir: /public/baiduyun/
  upDir: ./apks
```