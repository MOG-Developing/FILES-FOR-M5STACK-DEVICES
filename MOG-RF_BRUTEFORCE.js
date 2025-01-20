// MOG-RF: Brute Force RF Signal Generator

var value_prefix = 0x445700;  // Default start value
var no_bits = 8;  // 1-byte range -> 2^8=256 values to try
var delay_ms = 200;  // Delay after each try
var freq = "433920000";  // Fixed frequency (433 MHz by default)

function brute_force() {
    var max_val = value_prefix + (1 << no_bits);  // Calculate max value based on bits
    
    // Brute force loop
    for (var brute_val = value_prefix; brute_val < max_val; brute_val++) {
        fillScreen(0);  // Clear the screen
        
        var curr_val = brute_val.toString(16).toUpperCase();  // Current value as hex
        
        // Display status
        drawString("Sending:", 3, 0);
        drawString(curr_val, 3, 16);
        drawString("Press any key to stop", 3, 32);
        
        if (getAnyPress()) break;  // Exit if any key is pressed
        
        // Example full command: "subghz tx 445533 433920000 174 10"
        serialCmd("subghz tx " + curr_val + " " + freq + " 174 10");  // Customize te=174 count=10
        
        delay(delay_ms);  // Delay before next attempt
    }
}

function set_params() {
    var choice = dialogChoice([
        "Init value: " + value_prefix, "value_prefix",
        "Range bits: " + no_bits, "no_bits",
        "Delay: " + delay_ms + " ms", "delay_ms",
        "Frequency: " + freq, "freq",
        "Start Attack", "attack",
        "Exit", "exit"
    ]);

    if (choice == "") return false;  // Exit if no choice is selected

    // Handle the selected choice
    switch (choice) {
        case "value_prefix":
            value_prefix = parseInt(keyboard(String(value_prefix), 32, "Enter starting value (hex)"), 16);
            break;
        case "no_bits":
            no_bits = parseInt(keyboard(String(no_bits), 32, "Enter number of bits to iterate"), 10);
            break;
        case "delay_ms":
            delay_ms = parseInt(keyboard(String(delay_ms), 32, "Enter delay after each try (in ms)"), 10);
            break;
        case "freq":
            freq = keyboard(freq, 32, "Enter frequency (Hz)").trim();
            break;
        case "attack":
            if (!value_prefix || !no_bits || !delay_ms || !freq) {
                dialogError("Invalid parameters. Please ensure all settings are correct.");
                return false;
            }
            brute_force();
            break;
        case "exit":
            return false;  // Exit the loop if user chooses to exit
    }
    return true;  // Continue loop if parameters are valid
}

function main() {
    while (true) {
        if (!set_params()) break;  // Exit if user chooses to quit or invalid parameters
        fillScreen(0);  // Clear screen after each menu cycle
    }
}

main();  // Start the program
