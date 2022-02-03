import fx from 'fireworks'

const fireworksInit = (parentNode?: string) : void => {
    const  range:any[] = [...new Array(3)]

    const width = window.innerWidth
    const height = window.innerHeight
    const parent = parentNode ? document.getElementById(parentNode) : undefined
        range.map(() =>
            fx({
                x: Math.floor(Math.random() * width / 2) + width / 4,
                y: Math.floor(Math.random() * height / 2) + height / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784'],
                parentNode: parent ? parent : undefined,
                particleTimeout: 1000
            })
        )
}

export const fireworks = (parentNode?: string) : void => {
    for(let i=0; i<10; i++){
        setTimeout(() => {
            fireworksInit(parentNode)
        }, i*500 + 1);
    }
}