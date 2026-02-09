
import { Font } from '@react-pdf/renderer';

// --- Register Fonts ---
export const registerPdfFonts = () => {
    Font.register({
        family: "Roboto",
        fonts: [
            { src: "/fonts/Roboto-Regular.ttf", fontWeight: 400 },
            { src: "/fonts/Roboto-Bold.ttf", fontWeight: 600 },
            { src: "/fonts/Roboto-Bold.ttf", fontWeight: 700 },
            { src: "/fonts/Roboto-Bold.ttf", fontWeight: 800 },
            { src: "/fonts/Roboto-Bold.ttf", fontWeight: 900 },
        ],
    });

    Font.register({
        family: "Open Sans",
        fonts: [
            { src: "/fonts/OpenSans-Regular.ttf", fontWeight: 400 },
            { src: "/fonts/OpenSans-Bold.ttf", fontWeight: 600 },
            { src: "/fonts/OpenSans-Bold.ttf", fontWeight: 700 },
            { src: "/fonts/OpenSans-Bold.ttf", fontWeight: 800 },
            { src: "/fonts/OpenSans-Bold.ttf", fontWeight: 900 },
        ],
    });

    Font.register({
        family: "Montserrat",
        fonts: [
            { src: "/fonts/Montserrat-Regular.ttf", fontWeight: 400 },
            { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 600 },
            { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 700 },
            { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 800 },
            { src: "/fonts/Montserrat-Bold.ttf", fontWeight: 900 },
        ],
    });

    Font.register({
        family: "Oswald",
        fonts: [
            { src: "/fonts/Oswald-Regular.ttf", fontWeight: 400 },
            { src: "/fonts/Oswald-Bold.ttf", fontWeight: 600 },
            { src: "/fonts/Oswald-Bold.ttf", fontWeight: 700 },
            { src: "/fonts/Oswald-Bold.ttf", fontWeight: 800 },
            { src: "/fonts/Oswald-Bold.ttf", fontWeight: 900 },
        ],
    });
};
