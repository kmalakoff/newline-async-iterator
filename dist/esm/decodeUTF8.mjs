/* eslint-disable no-undef */ // https://developer.mozilla.org/en-US/docs/Glossary/Base64#Solution_2_%E2%80%93_JavaScript's_UTF-16_%3E_UTF-8_%3E_base64
/* c8 ignore start */ var decodeUTF8 = function decode(uint8Array) {
    var sView = "";
    for(var nPart, nLen = uint8Array.length, nIdx = 0; nIdx < nLen; nIdx++){
        nPart = uint8Array[nIdx];
        sView += String.fromCharCode(nPart > 251 && nPart < 254 && nIdx + 5 < nLen /* six bytes */  ? /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */ (nPart - 252) * 1073741824 + (uint8Array[++nIdx] - 128 << 24) + (uint8Array[++nIdx] - 128 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 247 && nPart < 252 && nIdx + 4 < nLen /* five bytes */  ? (nPart - 248 << 24) + (uint8Array[++nIdx] - 128 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 239 && nPart < 248 && nIdx + 3 < nLen /* four bytes */  ? (nPart - 240 << 18) + (uint8Array[++nIdx] - 128 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 223 && nPart < 240 && nIdx + 2 < nLen /* three bytes */  ? (nPart - 224 << 12) + (uint8Array[++nIdx] - 128 << 6) + uint8Array[++nIdx] - 128 : nPart > 191 && nPart < 224 && nIdx + 1 < nLen /* two bytes */  ? (nPart - 192 << 6) + uint8Array[++nIdx] - 128 : /* nPart < 127 ? */ /* one byte */ nPart);
    }
    return sView;
};
/* c8 ignore stop */ if (typeof TextDecoder !== "undefined") {
    var decoder = new TextDecoder("utf8");
    decodeUTF8 = function decodeTextDecoder(uint8Array) {
        return decoder.decode(uint8Array);
    };
}
export default decodeUTF8;
