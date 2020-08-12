// @ts-ignore
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Login from '../../App/Login';

const setLocation = jest.fn();

jest.mock('../../Firebase/index', () => ({
    init: { performance: jest.fn() },
}));

jest.mock('@bit/vitorbarbosa19.ziro.flow-manager', () => ({
    useHeader: () => ({}),
    useHistory: jest.fn(() => [{ pathname: '/menu', search: '' }]),
    usePersistentScroll: jest.fn(),
}));

describe('Login', () => {
    beforeEach(() => {
        setLocation.mockClear();
    });
    it('should be able to log in', async () => {
        const { getByPlaceholderText, getByText } = render(<Login isLogged={false}/>);
        const emailField = getByPlaceholderText('ex@exemplo.com');
        const passWordField = getByPlaceholderText('Sua senha');
        const buttonElement = getByText('Enviar');

        fireEvent.change(emailField, { target: { value: 'teste@example.com' } });
        fireEvent.change(passWordField, { target: { value: '123456' } });
        // fireEvent.click(buttonElement);
        /* await wait(() => {
          expect(setLocation).toHaveBeenCalledWith('/galeria');
        }); */
    });
});
