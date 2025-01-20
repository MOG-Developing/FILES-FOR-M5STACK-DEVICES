// Enhanced brute force IR signals script for Bruce firmware
// WARNING: Use responsibly. Excessive use may lock devices as a security measure.

var valuePrefix = 0x20DF0000; // Fixed prefix value (if known)
var rangeBits = 16;           // 2^16 = 65536 values to try
var delayMs = 20;             // Further reduced delay for faster brute-forcing
var protocol = "NEC";         // Common IR protocol

function bruteForce() {
    var maxVal = valuePrefix + (1 << rangeBits);
    var progress = 0; // Track progress for user feedback
    var totalAttempts = 1 << rangeBits;

    for (var bruteVal = valuePrefix; bruteVal < maxVal; bruteVal++) {
        var currVal = bruteVal.toString(16).toUpperCase();

        // Update user interface
        drawString("Sending", 3, 0);
        drawString(currVal, 3, 16);
        drawString("Press any key to stop", 3, 32);
        drawString("Progress: " + Math.round((progress / totalAttempts) * 100) + "%", 3, 48);

        if (getAnyPress()) {
            break; // Stop if a key is pressed
        }

        // Send IR command
        serialCmd("IRSend {\"Protocol\":\"" + protocol + "\",\"Bits\":32,\"Data\":\"0x" + currVal + "\"}");

        delay(delayMs); // Shortened delay for faster processing
        fillScreen(0); // Clear screen
        progress++;
    }

    drawString("Attack completed", 3, 64);
    delay(1000); // Show completion message briefly
    fillScreen(0);
}

function validateParams() {
    if (!valuePrefix || rangeBits <= 0 || delayMs <= 0 || !protocol) {
        dialogError("Invalid parameters");
        return false;
    }
    return true;
}

while (true) {
    var choice = dialogChoice([
        "Init value: 0x" + valuePrefix.toString(16).toUpperCase(), "valuePrefix",
        "Range bits: " + rangeBits, "rangeBits",
        "Delay: " + delayMs + " ms", "delayMs",
        "Protocol: " + protocol, "protocol",
        "Start Attack", "attack",
    ]);

    if (choice === "") {
        break; // Exit
    } else if (choice === "valuePrefix") {
        valuePrefix = parseInt(keyboard(String(valuePrefix), 32, "Starting value (hex)"), 16);
    } else if (choice === "rangeBits") {
        rangeBits = parseInt(keyboard(String(rangeBits), 32, "Bits to iterate"));
    } else if (choice === "delayMs") {
        delayMs = parseInt(keyboard(String(delayMs), 32, "Delay between tries (ms)"));
    } else if (choice === "protocol") {
        protocol = keyboard(protocol, 32, "Protocol");
    } else if (choice === "attack") {
        if (validateParams()) {
            bruteForce();
        }
    }

    fillScreen(0); // Clear screen after each operation
}
