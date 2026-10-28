# 本地预览

在项目目录打开终端，运行：

```bash
./preview.sh
```

浏览器访问 **http://127.0.0.1:4000/**。保持终端运行，编辑并保存文件后，Jekyll 会自动构建，浏览器会自动刷新。按 **Ctrl+C** 停止服务。

如果终端当前不在项目目录，可以使用完整路径：

```bash
/media/ih75601/Data/twyn/Lavania7.github.io/preview.sh
```

## 更换端口

如果 4000 端口被占用：

```bash
./preview.sh 4100
```

此时访问 **http://127.0.0.1:4100/**。自动刷新会使用下一个端口（例如 4101），两个端口都需要空闲。支持 1024–65534 之间的端口。

查看脚本用法：

```bash
./preview.sh --help
```

## 首次准备环境

脚本会使用 `Gemfile.lock` 指定的 Bundler 和依赖版本。首次安装需要联网；后续启动会复用项目中的 `.preview/` 缓存。

当前工作空间已准备好依赖，可以直接运行。换到新电脑，或更换 Ruby 版本时，需要先准备 Ruby 3.2 或更新版本，以及原生扩展的编译工具。Ubuntu / Debian 可执行：

```bash
sudo apt update
sudo apt install ruby-full ruby-dev build-essential zlib1g-dev
ruby --version
./preview.sh
```

请确认 `ruby --version` 显示 3.2 或更新版本；较旧的发行版可能需要另外安装新版本 Ruby。若提示找不到 `ruby.h`，通常是缺少与当前 Ruby 匹配的 `ruby-dev` 开发头文件。

如果下载的脚本丢失了执行权限：

```bash
chmod +x preview.sh
./preview.sh
```

## 常用编辑位置

- 首页：`index.md`
- About 页面：`about.md`
- 文章：`_posts/`，文件名使用 `YYYY-MM-DD-文章名.md`
- 样式：`assets/css/style.scss`
- 页面结构：`_layouts/`、`_includes/`
- 交互脚本：`assets/js/`
- 头像：`assets/picture/head1.jpg`

保存普通页面、文章、样式和脚本后，预览会自动更新。修改 `_config.yml` 后，需要先按 **Ctrl+C**，再运行 `./preview.sh`。

## 缓存和输出位置

- `.preview/gems/`：Bundler 工具。
- `.preview/bundle/`：项目依赖。
- `.preview/site/`：用于预览的静态网站。

`.preview/` 已加入 `.gitignore`。预览不会覆盖仓库里原有的 `_site/`；脚本和本说明也不会被发布成网站文件。
