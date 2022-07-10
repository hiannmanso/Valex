import Cryptr from 'cryptr'


export function encrypt(something:any) {
    const cryptr = new Cryptr('123')
    return cryptr.encrypt(something)
}

export function desencrypt(something:any) {
    const cryptr = new Cryptr('123')
    return cryptr.decrypt(something)
}