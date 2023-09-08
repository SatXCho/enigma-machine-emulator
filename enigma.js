// Constants
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ROTOR_I = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
const ROTOR_II = 'AJDKSIRUXBLHWTMCQGZNPYFVOE';
const ROTOR_III = 'BDFHJLCPRTXVZNYEIWGAKMUSQO';
const REFLECTOR_B = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

let rotorSettings = {
    rotor1: { mapping: ROTOR_I, position: 0 },
    rotor2: { mapping: ROTOR_II, position: 0 },
    rotor3: { mapping: ROTOR_III, position: 0 },
};

let reflector = REFLECTOR_B;

// Utility Functions
function rotateString(str, times) {
    times = times % str.length;
    return str.substring(times) + str.substring(0, times);
}

function processThroughRotor(letter, rotor, isForward = true) {
    let position = ALPHABET.indexOf(letter);
    let mappedLetter = isForward ? rotor[position] : ALPHABET[rotor.indexOf(letter)];
    return mappedLetter;
}

function processThroughReflector(letter) {
    return REFLECTOR_B[ALPHABET.indexOf(letter)];
}

function advanceRotors() {
    rotorSettings.rotor1.position = (rotorSettings.rotor1.position + 1) % 26;
    if (rotorSettings.rotor1.position === 0) {
        rotorSettings.rotor2.position = (rotorSettings.rotor2.position + 1) % 26;
        if (rotorSettings.rotor2.position === 0) {
            rotorSettings.rotor3.position = (rotorSettings.rotor3.position + 1) % 26;
        }
    }
}

function resetEnigmaMachine() {
    rotorSettings.rotor1.position = 0;
    rotorSettings.rotor2.position = 0;
    rotorSettings.rotor3.position = 0;
}

// Main Enigma Processing Function
function enigmaProcess(inputLetter) {
    advanceRotors();

    let rotor1 = rotateString(rotorSettings.rotor1.mapping, rotorSettings.rotor1.position);
    let rotor2 = rotateString(rotorSettings.rotor2.mapping, rotorSettings.rotor2.position);
    let rotor3 = rotateString(rotorSettings.rotor3.mapping, rotorSettings.rotor3.position);

    // Through the rotors
    let output = processThroughRotor(inputLetter, rotor1);
    output = processThroughRotor(output, rotor2);
    output = processThroughRotor(output, rotor3);

    // Through the reflector
    output = processThroughReflector(output);

    // And back through the rotors
    output = processThroughRotor(output, rotor3, false);
    output = processThroughRotor(output, rotor2, false);
    output = processThroughRotor(output, rotor1, false);

    return output;
}

function encryptMessage(message) {
    let encryptedMessage = "";
    for (let i = 0; i < message.length; i++) {
        encryptedMessage += enigmaProcess(message[i]);
    }
    return encryptedMessage;
}

function processMessage() {
    const input = document.getElementById('inputMessage').value;
    const result = encryptMessage(input);
    document.getElementById('outputMessage').innerText = result;
    resetEnigmaMachine();
}
