#include <string>
#include <sstream>
#include <iomanip>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <curl/curl.h>

static std::size_t getHtmlCallback(void *contents, std::size_t size, std::size_t nmemb, void *ptr)
{
    // Cast ptr to std::string pointer and append contents to that string
    ((std::string*)ptr)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::string urlEncode(const std::string &input)
{
    std::ostringstream encoded;
    encoded.fill('0');
    encoded << std::hex;

    for (char c : input)
    {
        if (isalnum(c) || c == '-' || c == '_' || c == '.' || c == '~')
        {
            encoded << c;
        }
        else if (c == ' ')
        {
            encoded << '+';
        }
        else
        {
            encoded << '%' << std::setw(2) << int(static_cast<unsigned char>(c));
        }
    }

    return encoded.str();
}


int main(int argc, char const *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "%s requires 2 parametters : type and value\n./cpoi-cli [c|uc|p|d] <value>\n", argv[0]);
        exit(1);
    }
    
    std::string htmlBuffer;
    CURL *curl;
    CURLcode res;

    // Initialize CURL session
    curl = curl_easy_init();
    std::string url = "http://cpoi.softplus.fr?" + std::string(argv[1]) +"=" + urlEncode(std::string(argv[2]));

    if (curl) {
        // Set the URL for the request
        // curl_easy_setopt(curl, CURLOPT_URL, url);

        // Follow HTTP 3xx redirects
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, getHtmlCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &htmlBuffer);

        // // Set the callback function to write the response data
        // curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

        // // Output the response directly to stdout
        // curl_easy_setopt(curl, CURLOPT_WRITEDATA, stdout);

        // // Perform the request and store the result
        // res = curl_easy_perform(curl);

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        res = curl_easy_perform(curl);

        // Check for errors
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
            return 1;
        }

        std::cout << htmlBuffer << std::endl; 
        // Clean up the CURL session
        curl_easy_cleanup(curl);
    }

    return 0;
}