export type Theme = {
    navBackground?: string,
    background?: string,
    sectionBackground?: string,
    text?: string,
    bottomShadow?: string,
    overlayBackground?: string,
    buttonColor?: string,
    buttonHover?: string,
    buttonHover2?: string,
    textShadow?: string,
    spinnerColor?: string,
    boxShadow?: string,
}

export const lightTheme: Theme = {
    navBackground: '#f0f0f0',
    background: '#f9fafb',
    sectionBackground: '#f9f9f9',
    text: '#333',
    bottomShadow: '0px 1px 10px 1px rgba(17, 162, 234, 0.2)',
    overlayBackground: 'rgba(0, 0, 0, 0.6)',
    buttonColor: '#444',
    buttonHover: '#1abc9c',
    buttonHover2: '#f0f0f0',
    textShadow: '1px 1px 1px rgba(0,0,0,.2)',
    spinnerColor: '#f0f0f0',
    boxShadow: '0px 1px 10px 1px rgba(97, 97, 97, 0.5)',
}

export const darkTheme: Theme = {
    navBackground: '#101010',
    background: '#101010',
    sectionBackground: '#282828',
    text: '#EEE',
    buttonColor: '#444',
    bottomShadow: '0px 1px 10px 1px rgba(17, 162, 234, 0.2)',
    overlayBackground: 'rgba(250, 250, 250, 0.3)',
    boxShadow: '0px 1px 10px 1px rgba(230, 230, 230, 0.5)',
    spinnerColor: '#f0f0f0',
    buttonHover2: "#f0f0f0"
}
