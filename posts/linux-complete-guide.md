---
title: "Linux 完全知识体系 — 从入门到精通"
date: "2026-06-25"
description: "涵盖基础命令、Shell脚本、系统管理、网络调优、安全加固、性能优化、Docker、eBPF、运维实战的完整 Linux 知识体系。"
tags: ["Linux", "运维", "Shell", "Docker", "性能优化"]
---

## 概述

本文是一份从入门到精通的 Linux 完全知识体系，涵盖：基础命令 · Shell 脚本 · 系统管理 · 网络调优 · 安全加固 · 性能优化 · Docker · eBPF · 运维实战。

---

## 第一章 Linux 基础认知与环境搭建

### 1.1 Linux 是什么

Linux 并非单一的操作系统，而是一个由以下四层组成的生态系统：

- **内核（Kernel）**：操作系统核心，管理硬件资源（CPU、内存、磁盘、网络）
- **Shell**：命令行解释器，用户与内核之间的桥梁（bash、zsh、fish）
- **文件系统**：组织和管理数据的层次化目录树
- **应用程序**：各种 GNU 工具、桌面环境、服务软件

### 1.2 核心哲学：一切皆文件

Linux 将一切资源都抽象为文件：

- **普通文件**：文本、二进制程序
- **目录文件**：文件夹
- **设备文件**：`/dev/sda`（磁盘）、`/dev/tty`（终端）
- **特殊文件**：`/proc/cpuinfo`（CPU 信息）、`/proc/meminfo`（内存信息）
- **套接字文件**：网络通信端点
- **管道文件**：进程间通信

### 1.3 环境搭建（3 种方式）

**方式一：虚拟机（推荐学习用）**

1. 下载 VMware Workstation Player（免费）或 VirtualBox
2. 下载 Ubuntu 24.04 LTS ISO 镜像
3. 新建虚拟机：内存 ≥ 4GB，硬盘 ≥ 20GB，网络选 NAT 模式
4. 启动安装，建议选择"最小安装"以获得纯净环境

**方式二：云服务器（推荐实践用）**

- 阿里云/腾讯云/AWS/华为云任选，最低 2 核 4G 配置

**方式三：WSL2（Windows 用户）**

```powershell
wsl --install -d Ubuntu-24.04
```

### 1.4 初始配置（所有环境通用）

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 创建普通用户（禁止直接用 root 操作）
sudo useradd -m -s /bin/bash devuser
sudo passwd devuser
sudo usermod -aG sudo devuser

# 3. 配置 SSH 密钥登录
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id devuser@your_server_ip

# 4. 修改主机名
sudo hostnamectl set-hostname myserver

# 5. 设置时区
sudo timedatectl set-timezone Asia/Shanghai

# 6. 安装常用工具
sudo apt install -y vim curl wget git net-tools htop tree unzip jq
```

---

## 第二章 命令行核心技能

### 2.1 命令基本格式

```bash
命令 [选项] [参数]
ls -la /home          # -l 长格式, -a 显示隐藏文件
grep -rn "error" /var/log/   # -r 递归, -n 显示行号

# 多个命令组合
command1 && command2   # command1 成功才执行 command2
command1 || command2   # command1 失败才执行 command2
command1 ; command2    # 顺序执行，无论成败
command1 | command2    # 管道：command1 输出作为 command2 输入
```

### 2.2 获取帮助

```bash
man ls          # 查看命令手册（最权威）
ls --help       # 简洁帮助
whatis ls       # 一行描述
whereis ls      # 查找命令位置
which ls        # 显示命令路径
type ls         # 显示命令类型（内置/外部/别名）
```

### 2.3 管道与重定向

```bash
# 标准文件描述符：0=stdin  1=stdout  2=stderr

# 输出重定向
command > file        # 覆盖写入 stdout
command >> file       # 追加写入 stdout
command 2> file       # 覆盖写入 stderr
command &> file       # stdout + stderr 都写入

# 输入重定向
command < file        # 从文件读取输入
command <<< "string"  # here-string

# 管道（最重要的概念之一）
cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
# 解释：读取日志 → 过滤404 → 提取IP → 排序 → 去重统计 → 倒序排列 → 取前10
```

### 2.4 压缩与归档

```bash
# tar 归档（最常用）
tar -czvf archive.tar.gz dir/     # 创建 gzip 压缩包
tar -xzvf archive.tar.gz          # 解压 gzip
tar -xzvf archive.tar.gz -C /opt/ # 解压到指定目录
tar -tzvf archive.tar.gz          # 不解压查看内容

# gzip / xz 单独使用
gzip file                         # 压缩为 file.gz
xz -9 file                        # 最高压缩比

# zip（跨平台兼容）
zip -r archive.zip dir/
unzip archive.zip -d /opt/
```

---

## 第三章 文件系统与目录结构（FHS 标准）

### 3.1 FHS 标准目录结构

```
/                   # 根目录
├── bin/            # 基础命令（ls, cp, mv）
├── sbin/           # 系统管理命令（iptables, fdisk）
├── etc/            # 配置文件
├── home/           # 普通用户家目录
├── root/           # root 用户家目录
├── var/            # 可变数据（日志、缓存、数据库）
├── tmp/            # 临时文件（重启可能清空）
├── usr/            # 用户程序（第二层级）
├── opt/            # 第三方软件
├── dev/            # 设备文件
├── proc/           # 虚拟文件系统（内核/进程信息）
├── sys/            # 内核对象信息
├── lib/            # 共享库
├── mnt/            # 临时挂载点
└── srv/            # 服务数据
```

### 3.2 /proc 虚拟文件系统详解

```bash
cat /proc/cpuinfo      # CPU 详细信息
cat /proc/meminfo      # 内存使用详情
cat /proc/loadavg      # 系统负载（1/5/15分钟）
cat /proc/version      # 内核版本信息
cat /proc/uptime       # 系统运行时间
grep -c ^processor /proc/cpuinfo  # 查看 CPU 核心数
```

---

## 第四章 权限、用户与组管理

### 4.1 权限系统详解

```bash
# 权限表示
# -rwxr-xr-x  →  所有者 rwx  所属组 r-x  其他人 r-x
# 数字表示：r=4  w=2  x=1  → 755

# 修改权限
chmod 755 file.txt          # 数字方式
chmod u+x file.txt          # 符号方式：所有者加执行权限
chmod -R 755 /var/www/      # 递归修改

# 修改所有者
chown user:group file.txt
chown -R www-data:www-data /var/www/
```

### 4.2 用户管理命令

```bash
# 创建用户
sudo useradd -m -s /bin/bash -G sudo,docker username

# 查看用户信息
id username                  # UID、GID、组
whoami                       # 当前用户
w                            # 更详细的登录信息

# 修改用户
sudo usermod -aG docker username    # 追加到附加组
sudo usermod -L username            # 锁定用户

# 删除用户
sudo userdel -r username            # 同时删除家目录
```

### 4.3 ACL 访问控制列表

```bash
# 给特定用户授权
setfacl -m u:alice:rwx file.txt

# 给特定组授权
setfacl -m g:developers:rx file.txt

# 设置默认 ACL（新文件自动继承）
setfacl -d -m u:alice:rwx /shared/
```

---

## 第五章 进程管理与服务管理（systemd）

### 5.1 进程查看

```bash
ps aux --sort=-%mem | head -10   # 按内存占用排序 TOP 10
pstree -p                       # 树状显示进程关系
top / htop                      # 动态实时监控
pgrep -fa nginx                 # 按名称查找进程
```

### 5.2 进程控制

```bash
kill <PID>                # SIGTERM（优雅退出）
kill -9 <PID>             # SIGKILL（强制杀死）
kill -HUP <PID>           # 重新加载配置
pkill -f "python app.py"  # 按匹配杀进程

# 后台运行
nohup your_command &      # 关闭终端不中断
disown -h %1              # 从作业列表中移除

# 前台/后台切换
jobs                      # 查看后台作业
fg %1                     # 回前台
bg %1                     # 后台继续
```

### 5.3 systemd 服务管理

```bash
systemctl start nginx        # 启动
systemctl stop nginx         # 停止
systemctl restart nginx      # 重启
systemctl reload nginx       # 重新加载配置
systemctl enable nginx       # 开机自启
systemctl status nginx       # 查看状态

# 日志查看
journalctl -u nginx -f       # 实时跟踪
journalctl -u nginx --since "1 hour ago"

# 自定义服务
sudo vim /etc/systemd/system/myapp.service
```

自定义服务示例：

```ini
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/start.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

---

## 第六章 Shell 脚本编程

### 6.1 变量与数据类型

```bash
#!/bin/bash
name="Linux"
readonly PI=3.14          # 只读变量
today=$(date +%Y-%m-%d)   # 命令替换
```

### 6.2 条件判断

```bash
# 字符串
[ "$str1" = "$str2" ]     # 相等
[ -z "$str" ]             # 为空
[ -n "$str" ]             # 非空

# 文件
[ -f "$file" ]            # 文件存在
[ -d "$dir" ]             # 目录存在
[ -r "$file" ]            # 可读
[ -w "$file" ]            # 可写
[ -x "$file" ]            # 可执行

# 数值
[ "$a" -eq "$b" ]         # 等于
[ "$a" -gt "$b" ]         # 大于
[ "$a" -lt "$b" ]         # 小于
```

### 6.3 循环与函数

```bash
# for 循环
for i in {1..10}; do echo "$i"; done
for file in /var/log/*.log; do echo "$file"; done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    ((count++))
done

# 函数
greet() {
    local name=$1          # local 限定局部变量
    echo "Hello, $name!"
}
result=$(greet "Alice")
```

### 6.4 错误处理与调试

```bash
set -euo pipefail          # 严格模式

trap 'echo "Error on line $LINENO"' ERR
trap 'echo "Script interrupted"; exit 1' INT TERM

# 调试
bash -x script.sh          # 执行时打印每条命令
bash -n script.sh          # 语法检查（不执行）
```

---

## 第七章 文本处理三剑客：grep · sed · awk

### 7.1 grep 文本搜索

```bash
grep -i "pattern" file.txt           # 忽略大小写
grep -v "pattern" file.txt           # 反向匹配
grep -rn "pattern" /path/            # 递归搜索 + 行号
grep -E "pattern1|pattern2" file.txt # 扩展正则（或 egrep）
```

### 7.2 sed 流编辑器

```bash
sed 's/old/new/g' file.txt           # 全局替换
sed 's/old/new/g' -i.bak file.txt    # 备份后修改
sed '3d' file.txt                    # 删除第 3 行
sed '/^$/d' file.txt                 # 删除空行
sed -n '5,10p' file.txt              # 打印 5-10 行
```

### 7.3 awk 文本分析语言

```bash
awk '{print $1, $3}' data.txt        # 打印第 1 和第 3 列
awk -F: '{print $1, $7}' /etc/passwd # 指定分隔符
awk '$3 > 1000' data.txt             # 条件过滤
awk '{sum+=$3} END {print sum}' data.txt  # 求和
awk '{sum+=$3} END {print sum/NR}' data.txt  # 平均值
```

### 7.4 实战案例

```bash
# 统计 Nginx 访问日志 IP 并排序
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# 统计 HTTP 状态码
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# 查找大文件并排序
find / -type f -size +100M 2>/dev/null | xargs ls -lhS 2>/dev/null | head -20
```

---

## 第八章 软件包管理与仓库配置

### 8.1 APT（Ubuntu/Debian）

```bash
sudo apt update                    # 更新源
sudo apt upgrade -y                # 升级所有包
sudo apt install nginx             # 安装
sudo apt remove nginx              # 卸载（保留配置）
sudo apt purge nginx               # 彻底卸载
sudo apt autoremove                # 清理无用依赖
sudo apt search nginx              # 搜索
```

### 8.2 源码编译安装

```bash
# 安装编译依赖
sudo apt install build-essential libssl-dev

# 下载、编译、安装
wget https://example.com/software.tar.gz
tar -xzf software.tar.gz
cd software
./configure --prefix=/usr/local
make -j$(nproc)
sudo make install
```

---

## 第九章 网络管理与诊断

### 9.1 网络信息查看

```bash
ip addr show                     # 查看 IP 地址
ip route show                    # 查看路由表
ss -tlnp                         # 查看监听端口
ss -s                            # 连接统计
```

### 9.2 网络诊断工具

```bash
ping -c 4 google.com             # 基础连通性
mtr google.com                   # 动态路由追踪
dig google.com +short            # DNS 查询
curl -I https://example.com      # 查看响应头
nc -zv 192.168.1.1 22            # TCP 端口测试
```

### 9.3 防火墙管理

```bash
# UFW（Ubuntu）
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw status verbose

# firewalld（CentOS/Rocky）
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload
```

### 9.4 SSH 安全配置

```bash
# /etc/ssh/sshd_config
Port 22222                     # 修改默认端口
PermitRootLogin no             # 禁止 root 远程登录
PasswordAuthentication no      # 禁用密码登录（只用密钥）
MaxAuthTries 3                 # 最大尝试次数
```

---

## 第十章 Linux 安全加固实战

### 10.1 fail2ban 防止暴力破解

```bash
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# /etc/fail2ban/jail.local
# [sshd]
# enabled = true
# maxretry = 3
# bantime = 3600

sudo systemctl enable --now fail2ban
sudo fail2ban-client status
```

### 10.2 审计系统 auditd

```bash
# 监控 /etc/passwd 的写入
sudo auditctl -w /etc/passwd -p wa -k passwd_changes

# 查询审计日志
sudo ausearch -k passwd_changes
```

### 10.3 安全加固清单

- 禁用 root SSH 登录
- 使用密钥认证
- 配置 fail2ban
- 设置 iptables/nftables 默认策略为 DROP
- 定期检查 SUID 文件：`find / -perm -4000 -type f`
- 禁用不必要的服务
- 开启审计日志

---

## 第十一章 性能监控与系统调优

### 11.1 CPU 监控

```bash
uptime                          # 系统负载
top                             # 实时监控
mpstat -P ALL 1 5               # 各 CPU 核心使用率
pidstat -u 1 5                  # 各进程 CPU 使用率
```

### 11.2 内存监控

```bash
free -h                         # 内存概览
vmstat 1 5                      # 虚拟内存统计
pidstat -r 1 5                  # 各进程内存使用
smem -tk                        # 更准确的内存统计
```

### 11.3 IO 监控

```bash
iostat -x 1                     # 磁盘 IO 详细信息
iotop                           # 实时 IO 监控（需安装）
pidstat -d 1 5                  # 各进程 IO
```

### 11.4 快速诊断流程

1. **系统整体**: `uptime` → 看负载
2. **CPU**: `top` → 看谁在吃 CPU → `mpstat` → 哪个核心
3. **内存**: `free -h` → 看 available → `smem` → 哪个进程
4. **IO**: `iostat -x 1` → `%util` → `iotop` → 哪个进程
5. **网络**: `ss -s` → `sar -n DEV` → `iftop` → `nethogs`

---

## 第十二章 内核参数深度调优

### 12.1 文件描述符与进程限制

```bash
# 查看当前限制
ulimit -a

# 永久配置 /etc/security/limits.conf
# *    soft    nofile    65535
# *    hard    nofile    65535
```

### 12.2 网络内核参数调优

```bash
# /etc/sysctl.d/99-network-tuning.conf
net.core.somaxconn = 32768
net.ipv4.tcp_max_syn_backlog = 16384
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
net.ipv4.ip_local_port_range = 1024 65000

# 启用 BBR 拥塞控制
net.ipv4.tcp_congestion_control = bbr
net.core.default_qdisc = fq

# 应用
sudo sysctl -p /etc/sysctl.d/99-network-tuning.conf
```

### 12.3 内存调优

```bash
vm.swappiness = 10               # 控制换出倾向（越小越避免 swap）
vm.dirty_ratio = 10              # 脏页比例
vm.dirty_background_ratio = 5    # 后台脏页比例
```

---

## 第十三章 存储管理（LVM / RAID / NFS）

### 13.1 LVM 逻辑卷管理

```bash
# 创建
sudo pvcreate /dev/sdb /dev/sdc
sudo vgcreate vg_data /dev/sdb /dev/sdc
sudo lvcreate -L 100G -n lv_data vg_data
sudo mkfs.ext4 /dev/vg_data/lv_data
sudo mount /dev/vg_data/lv_data /data

# 在线扩容（LVM 最大优势）
sudo lvextend -L +50G /dev/vg_data/lv_data
sudo resize2fs /dev/vg_data/lv_data    # ext4

# 快照
sudo lvcreate -L 10G -s -n snap_data /dev/vg_data/lv_data
```

### 13.2 NFS 网络文件系统

```bash
# 服务端
sudo apt install nfs-kernel-server -y
sudo vim /etc/exports
# /srv/nfs/share  192.168.1.0/24(rw,sync,no_subtree_check)
sudo exportfs -a

# 客户端
sudo mount 192.168.1.10:/srv/nfs/share /mnt/nfs
```

---

## 第十四章 服务部署实战

### 14.1 Nginx 部署

```bash
sudo apt install nginx -y
sudo systemctl enable --now nginx

# 虚拟主机配置
sudo vim /etc/nginx/sites-available/mysite.conf
```

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/mysite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 14.2 MySQL 部署

```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation

# 性能优化配置 /etc/mysql/mysql.conf.d/mysqld.cnf
# innodb_buffer_pool_size = 1G
# max_connections = 500
```

### 14.3 Redis 部署

```bash
sudo apt install redis-server -y
sudo vim /etc/redis/redis.conf
# requirepass your_password
# maxmemory 256mb
# maxmemory-policy allkeys-lru
sudo systemctl restart redis-server
```

---

## 第十五章 Docker 容器化实战

### 15.1 Docker 核心命令

```bash
# 镜像管理
docker pull nginx:alpine
docker images
docker rmi image_id

# 容器管理
docker run -d -p 8080:80 --name web nginx:alpine
docker ps -a
docker logs -f web
docker exec -it web /bin/bash
docker stop web && docker rm web

# 资源清理
docker system prune -a --volumes
```

### 15.2 Dockerfile 编写

```dockerfile
# 多阶段构建示例
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

### 15.3 Docker Compose

```yaml
version: '3.8'
services:
  web:
    build: ./app
    ports:
      - "8080:80"
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: myapp
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass redispwd

volumes:
  db_data:
```

```bash
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

---

## 第十六章 eBPF / XDP 前沿技术

### 16.1 eBPF 概述

eBPF（extended Berkeley Packet Filter）允许在无需修改内核源码的情况下，在 Linux 内核中安全高效地运行沙盒程序。

核心应用场景：
- **网络**：高性能数据包处理、负载均衡、DDoS 防御（Cilium）
- **可观测性**：无侵入系统追踪、性能分析（bcc / bpftrace）
- **安全**：运行时安全监控、系统调用过滤（Falco）

### 16.2 bpftrace 实战

```bash
# 追踪所有系统调用（按进程统计）
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_* { @[comm] = count(); }'

# 追踪文件打开
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_openat { printf("%s %s\n", comm, str(args->filename)); }'

# 追踪 TCP 连接建立
sudo bpftrace -e 'kprobe:tcp_connect { printf("TCP connect: %s\n", comm); }'
```

---

## 第十七章 高可用架构

### 17.1 Keepalived + Nginx 高可用

```bash
# Node1 (MASTER)
sudo vim /etc/keepalived/keepalived.conf
```

```conf
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    virtual_ipaddress {
        192.168.1.100/24
    }
}
```

### 17.2 HAProxy 负载均衡

```conf
frontend web_front
    bind *:80
    default_backend web_back

backend web_back
    balance roundrobin
    option httpchk GET /health
    server web1 192.168.1.11:80 check inter 3s
    server web2 192.168.1.12:80 check inter 3s
    server web3 192.168.1.13:80 check inter 3s
```

---

## 第十八章 运维监控体系（Prometheus + Grafana）

### 18.1 Prometheus + Node Exporter

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"

  node-exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
```

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

### 18.2 Grafana Dashboard 推荐

- **Node Exporter Full**（Dashboard ID: 1860）
- **MySQL Overview**（Dashboard ID: 7362）
- **Redis Dashboard**（Dashboard ID: 763）

---

## 第十九章 DDoS 防御方案

### 19.1 内核层防护

```bash
# SYN Flood 防护
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_synack_retries = 2

# 限制连接速率
net.ipv4.tcp_max_syn_backlog = 16384
```

### 19.2 iptables 防火墙规则

```bash
# 限制单 IP 连接数
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 50 -j DROP

# 限制 SYN 包速率
iptables -A INPUT -p tcp --syn -m limit --limit 100/s --limit-burst 200 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# 丢弃无效包
iptables -A INPUT -m state --state INVALID -j DROP
```

---

## 第二十章 实操案例集

### 案例 1: 服务器安全巡检脚本

```bash
#!/bin/bash
# security_audit.sh
echo "=== 系统安全巡检报告 ==="
echo "时间: $(date)"
echo "主机: $(hostname)"

echo -e "\n--- 系统信息 ---"
uname -a
uptime

echo -e "\n--- 磁盘使用 ---"
df -h | awk '$5 > 80 {print "警告: " $6 " 使用率 " $5}'

echo -e "\n--- 内存使用 ---"
free -h

echo -e "\n--- 高 CPU 进程 TOP 5 ---"
ps aux --sort=-%cpu | head -6

echo -e "\n--- 高内存进程 TOP 5 ---"
ps aux --sort=-%mem | head -6

echo -e "\n--- 监听端口 ---"
ss -tlnp

echo -e "\n--- 最近登录 ---"
last -n 10

echo -e "\n--- SUID 文件 ---"
find / -perm -4000 -type f 2>/dev/null
```

### 案例 2: 自动备份脚本

```bash
#!/bin/bash
# auto_backup.sh
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# 数据库备份
mysqldump --all-databases --single-transaction | gzip > "$BACKUP_DIR/mysql_$(date +%H%M%S).sql.gz"

# 配置文件备份
tar czf "$BACKUP_DIR/config_$(date +%H%M%S).tar.gz" /etc/nginx/ /etc/mysql/

# 保留最近 7 天
find /backup -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;
```

### 案例 3: 一键部署 LAMP 环境

```bash
#!/bin/bash
# install_lamp.sh
set -euo pipefail

sudo apt update && sudo apt upgrade -y

sudo apt install apache2 -y
sudo systemctl enable --now apache2

sudo apt install mysql-server -y
sudo systemctl enable --now mysql

sudo apt install php8.3 php8.3-mysql php8.3-curl -y
sudo systemctl restart apache2

echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
echo "LAMP installed. Visit http://$(hostname -I | awk '{print $1}')/info.php"
```

### 案例 4: 进程守护脚本

```bash
#!/bin/bash
# process_guard.sh
PROCESS="nginx"
LOG="/var/log/process_guard.log"

if ! pgrep -x "$PROCESS" > /dev/null; then
    echo "[$(date)] $PROCESS is down, restarting..." >> "$LOG"
    sudo systemctl restart nginx
    sleep 5
    if pgrep -x "$PROCESS" > /dev/null; then
        echo "[$(date)] $PROCESS restarted successfully" >> "$LOG"
    fi
fi
```

### 案例 5: 快速排查高 CPU 问题

```bash
#!/bin/bash
# find_high_cpu.sh
echo "=== Top 5 CPU consuming processes ==="
ps aux --sort=-%cpu | head -6

high_pid=$(ps aux --sort=-%cpu | awk 'NR==2{print $2}')
echo "Highest CPU PID: $high_pid"
echo "Process: $(cat /proc/$high_pid/cmdline | tr '\0' ' ')"
echo "Threads: $(ls /proc/$high_pid/task | wc -l)"
```

---

## 总结

本文涵盖了 Linux 从基础到高级的核心知识，包括：

- **基础**：文件系统、权限、进程管理
- **脚本**：Shell 编程、文本处理三剑客
- **网络**：配置管理、防火墙、SSH 安全
- **安全**：fail2ban、审计、加固
- **性能**：CPU/内存/IO 监控与调优
- **容器**：Docker 与 Docker Compose
- **前沿**：eBPF/XDP 技术
- **高可用**：Keepalived、HAProxy、Prometheus + Grafana

持续学习和实践是掌握 Linux 的关键。建议结合实际项目反复练习这些命令和配置。
