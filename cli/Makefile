CXX = g++
STATIC_CXXFLAGS = -O2 -static
CXXFLAGS = -O2
STATIC_LIBS = -lcurl -lssl -lcrypto -lz -ldl -pthread -lrt -static-libgcc -static-libstdc++
LIBS = -lcurl 

# Target binary
TARGET = cpoi-cli

all: $(TARGET)

$(TARGET): main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) main.o $(LIBS)

main.o: main.cc
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)