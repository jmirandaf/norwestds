FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# System packages + FreeCAD (headless via xvfb)
RUN apt-get update && apt-get install -y \
    freecad \
    python3 \
    python3-pip \
    wget \
    xvfb \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Headless wrapper — FreeCAD needs a virtual display even in --console mode
RUN printf '#!/bin/bash\nexec xvfb-run -a FreeCAD "$@"\n' \
    > /usr/local/bin/freecad-headless \
    && chmod +x /usr/local/bin/freecad-headless

# Blender (background rendering works without display)
ENV BLENDER_VERSION=4.2.3
RUN wget -q "https://download.blender.org/release/Blender4.2/blender-${BLENDER_VERSION}-linux-x64.tar.xz" \
    && tar xf "blender-${BLENDER_VERSION}-linux-x64.tar.xz" \
    && mv "blender-${BLENDER_VERSION}-linux-x64" /opt/blender \
    && ln -s /opt/blender/blender /usr/local/bin/blender \
    && rm "blender-${BLENDER_VERSION}-linux-x64.tar.xz"

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

ENV FREECAD_BIN=/usr/local/bin/freecad-headless
ENV BLENDER_BIN=/usr/local/bin/blender
ENV POLL_INTERVAL=5

CMD ["python3", "worker.py"]
