#include <stdio.h>
#include <stdlib.h>
#include <curl/curl.h>

// Callback function to write the data fetched from the HTTP request
size_t write_callback(void *ptr, size_t size, size_t nmemb, void *userdata) {
    fwrite(ptr, size, nmemb, (FILE *)userdata);
    return size * nmemb;
}
int main(int argc, char const *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "%s requires 2 parametters : type and value\n./cpoi-cli [c|uc|p|d] <value>\n", argv[0]);
        exit(1);
    }
    
    CURL *curl;
    CURLcode res;

    // Initialize CURL session
    curl = curl_easy_init();
    char url[300];
    sprintf(url, "http://cpoi.softplus.fr?%s=%s", argv[1], argv[2]);

    if (curl) {
        // Set the URL for the request
        curl_easy_setopt(curl, CURLOPT_URL, url);

        // Follow HTTP 3xx redirects
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

        // Set the callback function to write the response data
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

        // Output the response directly to stdout
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, stdout);

        // Perform the request and store the result
        res = curl_easy_perform(curl);

        // Check for errors
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }

        // Clean up the CURL session
        curl_easy_cleanup(curl);
    }

    return 0;
}