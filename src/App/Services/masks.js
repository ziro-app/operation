export const unmaskCpfOrCnpj = value => value.replace(/\(|\)|\.|\/|-|\s*/g, '');

export const maskCpf = value => value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');

export const maskCnpj = value => value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{4})/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');

export const maskCpfOrCnpj = (value) => {
    if (!value) {
        return value;
    }

    if (unmaskCpfOrCnpj(value).length <= 11) {
        return maskCpf(value);
    }

    return maskCnpj(value);
};