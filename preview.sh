#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'HELP'
用法：./preview.sh [端口]

启动 Jekyll 本地预览，保存文件后自动构建并刷新浏览器。
默认地址：http://127.0.0.1:4000/
示例：./preview.sh 4100
停止：Ctrl+C

首次启动会安装 Gemfile.lock 锁定的依赖，需要联网。
依赖和构建结果保存在 .preview/，不会提交到 Git。
详细说明见 help.md。
HELP
}

if [[ "${1:-}" == '--help' || "${1:-}" == '-h' ]]; then
  usage
  exit 0
fi
if (( $# > 1 )); then
  usage >&2
  exit 1
fi

preview_port="${1:-4000}"
if [[ ! "$preview_port" =~ ^[0-9]{1,5}$ ]]; then
  echo '端口必须为 1024 到 65534 之间的整数。' >&2
  exit 1
fi
preview_port=$((10#$preview_port))
if (( preview_port < 1024 || preview_port > 65534 )); then
  echo '端口必须为 1024 到 65534 之间的整数。' >&2
  exit 1
fi
livereload_port=$((preview_port + 1))

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_root"
if ! command -v ruby >/dev/null 2>&1 || ! command -v gem >/dev/null 2>&1; then
  echo '未找到 Ruby / RubyGems。请按 help.md 的首次安装说明配置环境。' >&2
  exit 1
fi

preview_dir="$project_root/.preview"
export GEM_HOME="$preview_dir/gems"
export GEM_PATH="$GEM_HOME:$(ruby -e 'puts Gem.path.join(":")')"
export GEM_SPEC_CACHE="$preview_dir/spec-cache"
export BUNDLE_GEMFILE="$project_root/Gemfile"
export BUNDLE_PATH="$preview_dir/bundle"
export BUNDLE_APP_CONFIG="$preview_dir/config"
export BUNDLE_USER_HOME="$preview_dir/bundler"
export BUNDLE_FROZEN=true
mkdir -p "$preview_dir"

bundler_version="$(ruby -e 'lock = File.read("Gemfile.lock"); version = lock[/^BUNDLED WITH\s*\n\s*(\S+)/, 1]; abort "Gemfile.lock 缺少 Bundler 版本。" unless version; puts version')"
bundler="$GEM_HOME/bin/bundle"
if [[ ! -f "$GEM_HOME/specifications/bundler-$bundler_version.gemspec" ]]; then
  echo "正在安装 Bundler $bundler_version……"
  gem install bundler --version "$bundler_version" --install-dir "$GEM_HOME" --no-document
fi

if ! ruby "$bundler" check >/dev/null 2>&1; then
  echo '正在安装网站依赖……'
  if ! ruby "$bundler" install; then
    echo '依赖安装失败。若提示缺少 ruby.h 或编译工具，请参阅 help.md。' >&2
    exit 1
  fi
fi

printf '\n本地预览：http://127.0.0.1:%s/\n' "$preview_port"
printf '自动刷新端口：%s\n' "$livereload_port"
printf '保存文件后自动更新；按 Ctrl+C 停止。\n\n'
exec ruby "$bundler" exec jekyll serve \
  --host 127.0.0.1 \
  --port "$preview_port" \
  --livereload \
  --livereload-port "$livereload_port" \
  --destination "$preview_dir/site"
