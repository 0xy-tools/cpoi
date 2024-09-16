CC = g++
CC = gcc
STATIC_CCFLAGS = -O2 -static
CCFLAGS = -O2
STATIC_LIBS = -L../../static -lnghttp3 -lcurl -lcrypto -ldl -static-libgcc*
# STATIC_LIBS = l:../../static/libcrypto.a l:../../static/libcurl.a l:../../static/libssl.a -lnghttp3 -lcurl -lcrypto -ldl -static-libgcc
# STATIC_LIBS = -lcurl -lssl -lcrypto -lz -ldl -pthread -lrt -static-libgcc -static-libstdc++
LIBS = -lcurl 

# Target binary
TARGET = cpoi-cli
STATIC_TARGET = cpoi-cli-static

all: $(TARGET)

$(TARGET): main.o
	$(CC) $(CCFLAGS) -o $(TARGET) main.o $(LIBS)

static: main_s.o
	$(CC) $(STATIC_CCFLAGS) -o $(STATIC_TARGET) main.o $(STATIC_LIBS)

main_s.o: main.c
	$(CC) $(STATIC_CCFLAGS) -c main.c

main.o: main.c
	$(CC) $(CCFLAGS) -c main.c

clean:
	rm -f *.o $(TARGET)