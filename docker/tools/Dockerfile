# 用于提供 LibreOffice & Inkscape 的工具镜像
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
    libreoffice \
    inkscape \
    ghostscript \
    fonts-dejavu-core && \
    rm -rf /var/lib/apt/lists/*

# 可选：创建非 root 用户（更安全）
RUN useradd -ms /bin/bash worker
USER worker
WORKDIR /work

# 示例：在容器中执行转换命令
# DOCX->PDF:  libreoffice --headless --convert-to pdf --outdir /work /work/input.docx
# EPS/AI->SVG: inkscape /work/input.eps --export-type=svg --export-filename=/work/output.svg
