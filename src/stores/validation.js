import Encrypt from 'jsencrypt';


const url = "https://gateway.kfsyscc.org/Gateway/a/CardClient/CardCheckVerify/";
let headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded");
headers.append("Accept", "application/json");

const pass_enc = pwd => {
    let crypt = new Encrypt.JSEncrypt();
    let pubkey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMTFn+dyIjvI31GnD12D8zgueC8fwgRt
xL/sETU8CDMaUlYygVH4jLwRc3UNr5minj8TgMnfDXocSoPKN3n28N8CAwEAAQ==
-----END PUBLIC KEY-----`;
    crypt.setPublicKey(pubkey);
    return encodeURIComponent(crypt.encrypt(pwd))
}


const validation = (cardtype, username, password) => {
    let epwd = pass_enc(password);
    epwd = encodeURIComponent(epwd);
    let data = `CardType=${cardtype}&UserId=${username}&Password=`+epwd+``;
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: data
    }).then((res) => {
        return res.json();
    })
};

export default validation;
