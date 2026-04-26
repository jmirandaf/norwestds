FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# FreeCAD está en universe en Ubuntu 22.04 (removido de 24.04)
RUN apt-get update && apt-get install -y software-properties-common \
    && add-apt-repository universe \
    && apt-get update && apt-get install -y \
    freecad \
    python3 \
    python3-pip \
    wget \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# freecadcmd is the true headless CLI — no display/xvfb needed
RUN ln -sf "$(which freecadcmd)" /usr/local/bin/freecad-headless

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
