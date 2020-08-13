### 1. 安装 nginx

```shell
yum -y install nginx
```

### 2. nginx设置开机启动

```shell
sudo systemctl enable nginx
```

### 3. 启动nginx

```shell
sudo service nginx start
```

或者

```shell
sudo service nginx restart
```

### 4. 安装git(可省略)

```shell
yum install -y git
```

### 5. yum更新(可省略)

```shell
sudo yum update
```

### 6. 安装Docker

> 直接 sudo sh bash.sh 或者一条一条执行命令

```shell
#!/bin/bash
# 移除掉旧的版本
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
# 删除所有旧的数据
sudo rm -rf /var/lib/docker
# 先更新
sudo yum update
# 添加源，使用了阿里云镜像
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
#  安装依赖包
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
# 配置缓存
sudo yum makecache fast
# 安装最新稳定版本的docker
sudo yum install docker-ce
# 配置镜像加速器
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
EOF
# 启动docker引擎并设置开机启动
sudo systemctl start docker
sudo systemctl enable docker
# 配置当前用户对docker的执行权限
sudo groupadd docker
sudo gpasswd -a ${USER} docker
sudo systemctl restart docker
```

### 7. 安装docker-compose

```shell
# 下载
curl -L https://get.daocloud.io/docker/compose/releases/download/1.26.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose 
# 赋权
sudo chmod +x /usr/local/bin/docker-compose
# 验证
docker-compose version
```

如果成功,则:

```shell
$ docker-compose version
docker-compose version 1.26.2, build eefe0d31
docker-py version: 4.2.2
CPython version: 3.7.7
OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019
```

### 8. 编写docker-compose.yml文件

> 进入到docker-compose所在文件夹,如果是按我的下载步骤一步步走下来的话,应该是在`/usr/local/bin/`,新建`docker-compose.yml`(最好是在本地电脑编辑完成后直接上传到该文件夹),下面是`docker-compose.yml`文件内容

```yml

version: '3'

services:
  mongodb:
    image: mongo:3.4.1
    volumes:
      #  /apps/easy-mock/data/db 是数据库文件存放地址，根据需要修改为本地地址
      - '/apps/easy-mock/data/db:/data/db'
    networks:
      - easy-mock
    restart: always

  redis:
    image: redis:4.0.6
    command: redis-server --appendonly yes
    volumes:
      #  /apps/easy-mock/data/redis 是 redis 数据文件存放地址，根据需要修改为本地地址
      - '/apps/easy-mock/data/redis:/data'
    networks:
      - easy-mock
    restart: always

  web:
    image: easymock/easymock:1.6.0
    # easy-mock 官方给出的文件，这里是 npm start，这里修改为 npm run dev
    command: /bin/bash -c "npm run dev"
    ports:
      - 7300:7300
    volumes:
      # 日志地址，根据需要修改为本地地址
      - '/apps/easy-mock/logs:/home/easy-mock/easy-mock/logs'
    networks:
      - easy-mock
    restart: always

networks:
  easy-mock:
```

### 9. 启动EasyMock

```shell
$ docker-compose up -d  # 主要一定要在`/usr/local/bin/`目录下,不然找不到docker-compose.yml文件
```

### 10. 配置Nginx

> 编辑nginx.conf文件(按上面步骤来的话应该是在`/etc/nginx`目录下),还是建议下载下来本地,修改好之后直接上传,将下面的内容替换掉配置中的server,主要是替换内容不是替换文件,我下面贴的只是nginx.conf需要更改的内容

```config

server {
    listen 443;
    server_name mock.xkcoding.com; # 监听的域名
    
    client_max_body_size 5G; # 突破上传大文件限制
    ssl on;
    ssl_certificate xxxxxx.pem; # https 的 pem 文件
    ssl_certificate_key xxxxxx.key; # https 的 key 文件

    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:7300;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
server{
    listen      80;
    server_name mock.xkcoding.com; # 监听的域名
    rewrite ^(.*)$  https://$host$1 permanent; # 强制 非https 跳转到 https
}
```

> 我是直接把CA证书直接上传到`/etc/nginx`目录下了,所以把pem和key直接替换了下文件名

### 11. 测试配置文件

> 配置文件弄好之后测试

```shelll
$ nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 12. 重启 Nginx 

```shell
$ nginx -s reload
```

### 13. DNS解析

给域名做一下DNS解析

### 14. @__@

@_ _@ 大功告成 @_ _@