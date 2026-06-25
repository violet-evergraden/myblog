---
title: "Linux 核心基础 — 从入门到精通"
date: "2026-06-25"
description: "涵盖基础命令、Shell脚本、文件系统、权限管理、进程管理、网络基础的 Linux 核心知识体系。"
tags: ["Linux", "运维", "Shell"]
---

## 概述

本文是一份 Linux 核心基础知识指南，涵盖：基础命令 · Shell 脚本 · 文件系统 · 权限管理 · 进程管理 · 文本处理 · 网络基础 · 包管理。

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

### 1.3 环境搭建

**方式一：虚拟机**

1. 下载 VMware Workstation Player（免费）或 VirtualBox
2. 下载 Ubuntu 24.04 LTS ISO 镜像
3. 新建虚拟机：内存 ≥ 4GB，硬盘 ≥ 20GB

**方式二：WSL2（Windows 用户）**

```powershell
wsl --install -d Ubuntu-24.04
```

### 1.4 初始配置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 创建普通用户
sudo useradd -m -s /bin/bash devuser
sudo usermod -aG sudo devuser

# 配置 SSH 密钥登录
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id devuser@your_server_ip

# 安装常用工具
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
command1 | command2    # 管道：command1 输出作为 command2 输入
```

### 2.2 获取帮助

```bash
man ls          # 查看命令手册
ls --help       # 简洁帮助
which ls        # 显示命令路径
type ls         # 显示命令类型（内置/外部/别名）
```

### 2.3 管道与重定向

```bash
# 标准文件描述符：0=stdin  1=stdout  2=stderr
command > file        # 覆盖写入 stdout
command >> file       # 追加写入 stdout
command 2> file       # 覆盖写入 stderr
command &> file       # stdout + stderr 都写入

# 管道（最重要的概念之一）
cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
# 读取日志 → 过滤404 → 提取IP → 排序 → 去重统计 → 倒序 → 取前10
```

### 2.4 压缩与归档

```bash
# tar 归档（最常用）
tar -czvf archive.tar.gz dir/     # 创建 gzip 压缩包
tar -xzvf archive.tar.gz          # 解压 gzip
tar -xzvf archive.tar.gz -C /opt/ # 解压到指定目录

# zip（跨平台兼容）
zip -r archive.zip dir/
unzip archive.zip -d /opt/
```

---

## 第三章 文件系统与目录结构

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
├── usr/            # 用户程序
├── dev/            # 设备文件
├── proc/           # 虚拟文件系统（内核/进程信息）
├── mnt/            # 临时挂载点
└── srv/            # 服务数据
```

### 3.2 /proc 虚拟文件系统

```bash
cat /proc/cpuinfo      # CPU 信息
cat /proc/meminfo      # 内存详情
cat /proc/loadavg      # 系统负载
cat /proc/version      # 内核版本
```

---

## 第四章 权限、用户与组管理

### 4.1 权限系统

```bash
# 权限表示：-rwxr-xr-x → 所有者 rwx  所属组 r-x  其他人 r-x
# 数字表示：r=4  w=2  x=1  → 755

chmod 755 file.txt          # 数字方式
chmod u+x file.txt          # 符号方式
chmod -R 755 /var/www/      # 递归修改

chown user:group file.txt
chown -R www-data:www-data /var/www/
```

### 4.2 用户管理

```bash
sudo useradd -m -s /bin/bash -G sudo,docker username
id username                  # UID、GID、组
whoami                       # 当前用户
sudo usermod -aG docker username    # 追加到附加组
sudo userdel -r username            # 删除用户及家目录
```

### 4.3 ACL 访问控制

```bash
setfacl -m u:alice:rwx file.txt     # 给特定用户授权
setfacl -m g:developers:rx file.txt # 给特定组授权
```

---

## 第五章 进程管理与服务管理

### 5.1 进程查看与控制

```bash
ps aux --sort=-%mem | head -10   # 按内存排序 TOP 10
top / htop                      # 实时监控
pgrep -fa nginx                 # 按名称查找

kill <PID>                # SIGTERM（优雅退出）
kill -9 <PID>             # SIGKILL（强制杀死）
nohup your_command &      # 关闭终端不中断
```

### 5.2 systemd 服务管理

```bash
systemctl start nginx        # 启动
systemctl stop nginx         # 停止
systemctl restart nginx      # 重启
systemctl enable nginx       # 开机自启
systemctl status nginx       # 查看状态

journalctl -u nginx -f       # 实时查看日志
```

自定义服务示例：

```ini
# /etc/systemd/system/myapp.service
[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/myapp
ExecStart=/opt/myapp/start.sh
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

---

## 第六章 Shell 脚本编程

### 6.1 变量与条件判断

```bash
#!/bin/bash
name="Linux"
readonly PI=3.14          # 只读变量
today=$(date +%Y-%m-%d)   # 命令替换

# 字符串判断
[ "$str1" = "$str2" ]     # 相等
[ -z "$str" ]             # 为空

# 文件判断
[ -f "$file" ]            # 文件存在
[ -d "$dir" ]             # 目录存在

# 数值判断
[ "$a" -eq "$b" ]         # 等于
[ "$a" -gt "$b" ]         # 大于
```

### 6.2 循环与函数

```bash
# for 循环
for i in {1..10}; do echo "$i"; done

# while 循环
count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    ((count++))
done

# 函数
greet() {
    local name=$1
    echo "Hello, $name!"
}
result=$(greet "Alice")
```

### 6.3 错误处理

```bash
set -euo pipefail          # 严格模式：出错即停
trap 'echo "Error on line $LINENO"' ERR
```

---

## 第七章 文本处理三剑客：grep · sed · awk

### 7.1 grep 搜索

```bash
grep -i "pattern" file.txt           # 忽略大小写
grep -rn "pattern" /path/            # 递归搜索 + 行号
grep -E "pattern1|pattern2" file.txt # 扩展正则
```

### 7.2 sed 编辑

```bash
sed 's/old/new/g' file.txt           # 全局替换
sed 's/old/new/g' -i.bak file.txt    # 备份后修改
sed '/^$/d' file.txt                 # 删除空行
sed -n '5,10p' file.txt              # 打印 5-10 行
```

### 7.3 awk 分析

```bash
awk '{print $1, $3}' data.txt        # 打印第 1 和第 3 列
awk -F: '{print $1, $7}' /etc/passwd # 指定分隔符
awk '$3 > 1000' data.txt             # 条件过滤
awk '{sum+=$3} END {print sum}' data.txt  # 求和
```

### 7.4 实战案例

```bash
# 统计 Nginx 访问日志 IP 并排序
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# 查找大文件
find / -type f -size +100M 2>/dev/null | xargs ls -lhS 2>/dev/null | head -20
```

---

## 第八章 网络管理与诊断

### 8.1 网络信息查看

```bash
ip addr show                     # 查看 IP 地址
ip route show                    # 查看路由表
ss -tlnp                         # 查看监听端口
```

### 8.2 网络诊断

```bash
ping -c 4 google.com             # 连通性测试
curl -I https://example.com      # 查看响应头
dig google.com +short            # DNS 查询
nc -zv 192.168.1.1 22            # 端口测试
```

### 8.3 防火墙（UFW）

```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw status verbose
```

### 8.4 SSH 安全配置

```bash
# /etc/ssh/sshd_config
Port 22222                     # 修改默认端口
PermitRootLogin no             # 禁止 root 远程登录
PasswordAuthentication no      # 只用密钥登录
MaxAuthTries 3                 # 最大尝试次数
```

---

## 第九章 软件包管理

### 9.1 APT（Ubuntu/Debian）

```bash
sudo apt update                    # 更新源
sudo apt upgrade -y                # 升级所有包
sudo apt install nginx             # 安装
sudo apt remove nginx              # 卸载
sudo apt purge nginx               # 彻底卸载
sudo apt autoremove                # 清理无用依赖
```

### 9.2 源码编译安装

```bash
sudo apt install build-essential libssl-dev
wget https://example.com/software.tar.gz
tar -xzf software.tar.gz && cd software
./configure --prefix=/usr/local
make -j$(nproc)
sudo make install
```

---

> 持续学习和实践是掌握 Linux 的关键。建议结合实际项目反复练习这些命令和配置。
