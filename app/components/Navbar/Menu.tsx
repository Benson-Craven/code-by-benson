import { motion } from "framer-motion"
import { opacity, slideLeft, mountAnim } from "./anim"
import Link from "./Link"
import { useEffect } from "react"
import { FaGithub, FaLinkedin, FaBehance, FaDribbble } from "react-icons/fa6"

const menu = [
    {
        title: "Projects",

        description: "To See Everything",

        images: "projects2.jpg",

        url: "/#project-section",
    },

    {
        title: "Info",

        description: "To Learn Everything",

        images: "agence1.jpg",

        url: "/info",
    },

    {
        title: "Contact",

        description: "To Send a FAX",

        images: "contact1.jpg",

        url: "mailto:bensoncraven@hotmail.co.uk",
    },
]

interface Props {
    closeMenu: () => void // Define the type of openMenu
}

const Menu: React.FC<Props> = ({ closeMenu }) => {
    useEffect(() => {
        // Prevent scrolling on mount
        document.body.style.overflow = "hidden"
        return () => {
            // Re-enable scrolling on unmount
            document.body.style.overflow = ""
        }
    }, [])
    return (
        <div className="fixed left-0 top-0 z-20 m-0 flex h-[100vh] w-[100vw] flex-col justify-between">
            <div className="flex justify-end p-5">
                <motion.svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Scribble-26.svg"
                    variants={slideLeft}
                    {...mountAnim}
                    onClick={() => {
                        closeMenu()
                    }}
                    className="h-20 w-20 cursor-pointer fill-white transition-colors duration-500 hover:fill-[#D3FD50] md:h-24 md:w-24"
                >
                    <path d="M133.19 62.6005C138.683 46.6517 144.163 30.6904 149.582 14.7169C150.136 13.0543 149.262 11.0345 147.624 10.3325C146.011 9.54428 143.917 10.197 142.92 11.872C129.434 34.7052 116.318 57.822 103.891 81.3203C85.3808 116.322 69.1483 152.517 53.5443 188.812C53.1502 189.735 54.6901 190.487 55.1704 189.612C74.2966 155.054 93.9771 120.743 112.438 85.8401C124.84 62.4033 137.033 38.8681 149.287 15.4067C147.058 14.4584 144.841 13.51 142.624 12.5617C138.055 28.7938 133.572 45.0629 129.077 61.332C128.448 63.6227 132.426 64.8543 133.19 62.6005Z" />
                    <path d="M31.1815 110.706C56.2193 96.9244 77.1806 92.3062 99.1764 91.7643C121.135 91.2347 144.19 95.0033 172.381 98.2424C174.635 98.5133 176.654 96.8631 176.925 94.6216C177.196 92.3802 175.62 90.2988 173.366 90.0279C145.434 86.5549 122.17 82.4536 99.0038 82.7615C75.8626 83.0447 52.8941 87.9341 26.5385 102.159C24.1739 103.44 23.3117 106.408 24.5925 108.76C25.8733 111.125 28.8292 111.999 31.1815 110.706Z" />
                </motion.svg>
                {/* <motion.svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Scribble-26.svg"
                    variants={slideLeft}
                    {...mountAnim}
                    onClick={() => {
                        closeMenu()
                    }}
                    className="h-12 w-12 cursor-pointer fill-white transition-colors duration-500 md:h-24 md:w-24 hover:[&>path]:fill-[#D3FD50]"
                >
                    <path d="M117.609 39.962C97.762 31.2812 35.9768 57.136 10 67.3188L16.4308 62.2771" />
                    <path
                        d="M126.032 50.7069C98.6635 50.6004 65.6949 72.4192 38.1777 72.9866"
                        stroke="white"
                        stroke-width="11"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path d="M137.906 59.9856C128.157 60.1885 114.677 62.0816 100.269 65.0932C85.864 68.1051 70.5492 72.2549 57.1994 76.9599C52.1664 78.7561 47.4693 80.7874 43.2792 82.9705C41.1082 84.1042 39.0798 85.2886 37.2034 86.4765C36.7534 86.7618 36.5948 87.2286 36.7438 87.6128C36.8801 88.002 37.3016 88.2539 37.6217 88.2086C40.0179 87.8666 42.4108 87.4933 44.8038 87.1202C42.395 86.8654 39.9863 86.6103 37.5775 86.3868C37.7169 86.964 37.8532 87.5414 37.9927 88.1189C40.0655 87.409 42.2556 86.6943 44.5376 85.9368C48.9399 84.4687 53.6973 82.8805 58.6734 81.1636C71.8361 76.5618 86.9194 72.1516 101.087 68.7409C115.254 65.3306 128.525 62.9392 138.001 62.3868C138.664 62.3485 139.177 61.7998 139.152 61.139C139.127 60.4782 138.569 59.9717 137.906 59.9856Z" />
                    <path d="M155.167 65.0347C133.501 64.126 108.462 67.3034 83.6551 73.6179C66.2739 78.0719 48.9275 83.6692 32.6841 89.7307C33.8568 91.8261 35.0294 93.9214 36.2053 96.0167C38.6521 94.0938 41.0989 92.1706 43.5489 90.2477C46.7088 87.7663 42.224 82.048 39.0609 84.5233C36.6109 86.4418 34.1578 88.36 31.7046 90.2784C30.9883 90.8397 30.532 91.6232 30.3736 92.4593C30.2119 93.2945 30.3545 94.1845 30.7728 94.9261C31.1849 95.67 31.8695 96.2586 32.6651 96.5571C33.4606 96.8607 34.3669 96.8833 35.2258 96.5641C51.2664 90.6112 68.391 85.1211 85.4806 80.7352C109.835 74.4423 133.961 69.5832 155.133 69.0387C156.239 69.0102 157.139 68.1566 157.148 67.053C157.158 65.9491 156.27 65.081 155.167 65.0347Z" />
                    <path d="M154.077 78.7371C154.885 77.8553 155.696 76.9733 156.504 76.0906C156.622 75.9622 156.701 75.67 156.634 75.4038C156.574 75.1363 156.371 74.9103 155.997 74.7696C153.37 73.7801 149.674 72.9547 145.164 72.3377C140.651 71.7247 135.323 71.3212 129.444 71.2806C126.208 71.2575 122.81 71.3558 119.292 71.5852C115.774 71.8027 112.135 72.1003 108.411 72.4758C100.966 73.2267 93.1946 74.2929 85.42 75.6355C69.8675 78.3219 54.3341 82.098 41.2759 86.5495C36.994 88.0185 32.9877 89.6073 29.3746 91.3705C25.7614 93.1289 22.5508 95.0677 19.8314 97.1386C18.0216 98.5122 16.4243 99.9328 15.0614 101.389C14.0694 102.45 13.689 103.286 13.6256 104.161C13.5559 105.036 13.7841 105.93 14.2658 106.663C14.7444 107.398 15.4734 107.966 16.3038 108.251C17.1311 108.54 18.0438 108.518 18.3925 108.395C25.2448 105.959 32.0274 103.159 38.81 100.36C38.8544 100.34 38.883 100.291 38.8735 100.245C38.864 100.199 38.8196 100.163 38.7689 100.163C31.4347 100.17 24.0975 100.177 16.8331 100.547C17.9424 102.883 19.0518 105.218 20.1643 107.553C21.4701 106.801 23.0073 106.042 24.7473 105.271C27.3653 104.116 30.4237 102.908 33.8277 101.618C37.2317 100.333 40.9906 98.9731 45.0349 97.6121C57.364 93.4373 72.4474 89.6951 87.4991 86.5485C95.0297 84.9746 102.557 83.5455 109.755 82.2942C113.352 81.6688 116.867 81.0885 120.262 80.5605C123.653 80.0448 126.918 79.5298 130.021 79.0347C135.656 78.1371 140.752 77.3432 145.098 76.8605C149.44 76.3736 153.024 76.199 155.607 76.4354C155.436 75.9949 155.268 75.5546 155.1 75.1144C154.555 76.1803 154.01 77.2471 153.468 78.3137C153.281 78.6788 153.798 79.0388 154.077 78.7371Z" />
                    <path d="M166.069 91.5791C145.246 88.6867 122.296 88.681 98.8102 92.4587C91.3556 93.6561 83.8535 95.2554 76.4275 97.4645C70.2819 99.2739 64.2474 101.692 58.2793 104.312C64.6911 103.126 71.0553 102.147 77.277 100.97C84.7981 99.569 92.2051 98.1564 99.5423 96.9412C122.625 93.122 145.062 91.4596 165.933 92.8884C166.291 92.9128 166.605 92.6548 166.643 92.3002C166.681 91.9455 166.424 91.6286 166.069 91.5791Z" />
                    <path d="M172.824 109.109C160.432 103.282 141.114 102.203 120.338 103.778C105.119 104.93 89.1288 107.594 74.4669 110.837C67.0441 112.487 60.0682 114.725 53.6976 116.933C50.9116 117.902 48.2461 118.882 45.7138 119.843C44.9151 120.145 44.4809 120.52 44.221 120.998C43.9579 121.474 43.8691 122.043 43.9706 122.578C44.072 123.112 44.3635 123.608 44.7851 123.955C45.2003 124.303 45.7422 124.493 46.0592 124.488C52.2998 124.398 58.55 124.191 64.8033 123.983C58.7148 122.543 52.6294 121.104 46.5282 119.782C46.6455 121.33 46.7597 122.879 46.8769 124.427C49.5519 124.065 52.3538 123.671 55.2538 123.236C61.8875 122.233 69.0472 121.105 76.3749 119.503C90.8593 116.321 106.415 113.009 121.137 110.722C141.244 107.6 159.82 106.553 172.134 110.804C172.565 110.953 173.015 110.622 173.173 110.239C173.328 109.856 173.236 109.304 172.824 109.109Z" />
                    <path d="M163.096 124.889C156.595 124.251 148.9 123.084 140.542 122.072C132.187 121.062 123.154 120.214 114.017 120.268C105.497 120.336 96.8765 121 88.7057 122.996C81.9262 124.651 75.5176 127.3 69.8221 130.896C69.1819 131.301 69.2707 132.312 69.5749 132.876C69.8824 133.441 70.681 134.068 71.372 133.754C77.1689 131.124 83.3905 129.514 89.8467 128.347C97.6214 126.946 105.818 126.3 114.068 126.223C122.904 126.122 131.791 126.46 140.146 126.841C148.497 127.221 156.307 127.651 162.956 127.683C163.723 127.687 164.37 127.121 164.411 126.357C164.449 125.593 163.863 124.964 163.096 124.889Z" />
                    <path d="M187.7 128.341C160.871 124.476 130.517 127.998 100.604 134.228C89.463 136.554 78.3699 139.213 67.5304 142.187C59.8984 144.272 52.4533 146.806 45.0939 149.161C43.918 149.538 43.2334 150.724 43.4616 151.878C43.6898 153.032 44.7738 153.868 46.0035 153.768C53.7592 153.139 61.6543 152.369 69.4828 151.042C80.6108 149.169 91.7323 146.768 102.749 144.438C132.349 138.163 161.118 132.097 187.18 133.536C188.603 133.615 189.846 132.598 189.985 131.192C190.128 129.787 189.114 128.545 187.7 128.341Z" />
                    <path d="M174.007 145.414C163.937 143.183 150.616 142.745 137.254 144.341C131.641 144.992 126.047 146.194 120.763 147.822C117.562 148.801 114.529 150.136 111.67 151.538C111.619 151.563 111.603 151.628 111.619 151.677C111.635 151.726 111.686 151.767 111.743 151.758C114.874 151.219 118.107 150.817 121.343 150.271C126.696 149.378 132.211 148.636 137.691 147.943C150.727 146.343 163.744 146.11 173.531 147.812C174.181 147.925 174.79 147.47 174.913 146.839C175.037 146.207 174.65 145.556 174.007 145.414Z" />
                    <path d="M84.9293 32.1194C78.1054 35.7836 71.7761 42.3016 65.8651 50.4988C59.9572 58.701 54.474 68.6065 49.4853 79.1281C39.4952 100.165 31.524 123.691 26.0979 140.793C24.808 144.855 23.6543 148.552 22.6433 151.758C24.6971 152.112 26.754 152.466 28.811 152.82C29.0709 144.003 31.2007 134.002 34.6776 123.58C38.1481 113.157 42.9531 102.311 48.4996 91.7612C59.58 70.6568 73.6777 50.7419 85.7818 37.5877C84.4031 36.9807 83.0244 36.3738 81.6489 35.7668C81.6172 36.1266 81.5823 36.486 81.5442 36.8448C80.5078 46.736 77.0373 56.167 72.2451 65.4487C67.4593 74.7286 61.3612 83.8382 55.1776 93.0543C48.9972 102.273 42.7281 111.598 37.6316 121.372C32.5415 131.144 28.6146 141.384 27.2168 152.402C27.1376 153.028 27.2959 153.637 27.6255 154.127C27.952 154.62 28.456 154.991 29.0233 155.155C29.5907 155.323 30.2151 155.284 30.7571 155.045C31.2991 154.81 31.7617 154.382 32.0343 153.804C50.1319 115.772 65.9601 76.0404 83.0815 37.6942C81.3161 37.1284 79.5475 36.5624 77.779 35.9966C71.719 65.4988 57.8305 96.0425 45.8658 126.151C42.1164 135.59 38.7028 145.058 36.1165 154.522C36.0214 154.863 35.9296 155.205 35.8409 155.546C37.2354 155.947 38.63 156.347 40.0214 156.747C41.0609 151.218 41.7456 145.6 42.4302 139.983C42.4872 139.496 41.7423 139.309 41.5648 139.767C39.5268 145.046 37.4857 150.324 35.7996 155.691C35.6633 156.13 35.7204 156.719 35.974 157.209C36.2212 157.701 36.6649 158.09 37.1879 158.271C37.7045 158.457 38.2939 158.433 38.7979 158.207C39.3018 157.984 39.717 157.562 39.98 156.892C40.1068 156.568 40.2337 156.244 40.3604 155.918C43.85 146.9 47.517 137.673 51.2443 128.287C63.1265 98.3438 77.1102 67.5279 83.2684 37.1161C83.411 36.4026 83.2747 35.6939 82.9261 35.1158C82.5806 34.5355 82.0165 34.0899 81.3731 33.887C80.7297 33.6801 80.0135 33.7181 79.3954 33.9923C78.7774 34.262 78.2544 34.7609 77.9628 35.4185C60.9112 73.9676 45.2922 113.729 27.4418 151.63C29.0488 152.097 30.6556 152.564 32.2593 153.031C33.5144 142.807 37.1466 133.117 42.0371 123.657C46.9212 114.199 53.0573 104.99 59.2187 95.7569C65.3769 86.5221 71.5604 77.2641 76.5079 67.6445C81.4523 58.0271 85.1701 48.0272 86.2921 37.3424C86.3301 36.9554 86.3682 36.5674 86.403 36.1786C86.4918 35.1586 85.8927 34.1713 84.9862 33.7885C84.0924 33.3796 82.9611 33.6043 82.267 34.3577C69.8396 47.8913 55.3519 67.8385 43.682 89.1793C37.8534 99.8518 32.7411 110.874 28.9885 121.641C25.239 132.41 22.8397 142.921 22.4942 152.614C22.4657 153.405 22.7383 154.153 23.2137 154.727C23.6891 155.305 24.3737 155.703 25.109 155.829C25.8412 155.961 26.6209 155.818 27.2611 155.436C27.9077 155.058 28.4148 154.447 28.6652 153.676C29.6985 150.459 30.868 146.771 32.1579 142.725C37.6126 125.708 45.1749 102.305 54.3949 81.3765C59.0096 70.9157 64.0521 61.0796 69.4655 53.0026C74.8726 44.9215 80.6568 38.6232 86.6217 35.1564C87.3412 34.7393 87.262 33.6306 86.9102 33.0037C86.5615 32.3768 85.6614 31.7264 84.9293 32.1194Z" />
                    <path d="M98.4065 57.6389C84.1345 79.0615 71.9162 102.232 64.3951 127.109C63.0449 131.578 61.8373 136.097 60.7851 140.666C60.69 141.086 60.7597 141.512 60.9562 141.864C61.1527 142.218 61.4792 142.495 61.8596 142.629C62.2399 142.766 62.6709 142.76 63.0448 142.611C63.422 142.463 63.7454 142.179 63.9387 141.789C77.1205 115.182 84.2643 85.4806 95.0151 58.2183C93.9121 57.7904 92.8124 57.3625 91.7126 56.9347C80.8952 85.0261 69.2793 113.449 60.1006 142.238C59.9484 142.709 59.9991 143.205 60.2083 143.617C60.4175 144.032 60.7882 144.36 61.2224 144.516C61.6598 144.675 62.1543 144.658 62.579 144.471C63.0037 144.288 63.3587 143.938 63.5426 143.478C69.0415 129.856 73.5771 111.492 79.5736 94.162C82.5688 85.5012 85.9252 77.1091 89.9028 69.7367C93.8805 62.362 98.4825 56.0196 103.915 51.4065C102.907 50.7847 101.896 50.1625 100.888 49.5406C96.9295 65.8627 87.8079 80.5527 78.6355 95.4C69.479 110.25 60.2717 125.259 56.4969 142.388C56.3955 142.853 56.4746 143.32 56.6902 143.708C56.9057 144.097 57.2606 144.405 57.6758 144.56C58.091 144.718 58.5633 144.722 58.9817 144.571C59.4 144.422 59.7646 144.122 59.996 143.704C68.5059 128.26 75.596 112.362 83.3453 96.9331C91.0946 81.5023 99.4967 66.5447 110.593 52.9288C109.499 52.3513 108.406 51.7742 107.309 51.1967C102.381 67.8892 94.4669 84.1466 86.5274 100.39C83.1329 107.337 79.8747 114.359 77.0127 121.47C75.6942 124.759 74.6515 128.15 73.6848 131.53C73.5485 132.011 74.2807 132.313 74.5216 131.875C76.2141 128.808 77.9794 125.766 79.5736 122.63C83.0125 115.843 86.5337 109.003 89.9313 102.052C97.8676 85.8045 105.886 69.3747 110.942 52.2692C111.195 51.4078 110.783 50.4477 110.01 50.0585C109.252 49.6402 108.225 49.8408 107.658 50.5368C96.2956 64.4833 87.7635 79.7033 79.9635 95.2355C72.1666 110.77 65.0956 126.621 56.6871 141.882C57.8534 142.321 59.0196 142.76 60.186 143.198C63.758 126.897 72.6768 112.217 81.8365 97.3759C90.9836 82.5327 100.368 67.5317 104.523 50.4227C104.714 49.6341 104.355 48.7876 103.687 48.3892C103.027 47.9705 102.111 48.0314 101.493 48.5568C95.5729 53.5979 90.7427 60.3269 86.6224 67.9681C82.5053 75.6116 79.0981 84.1796 76.0713 92.9513C70.024 110.486 65.4854 128.873 60.1481 142.108C61.2954 142.522 62.4427 142.935 63.5901 143.349C72.68 114.737 84.2296 86.3589 95.0184 58.2056C95.1959 57.7473 95.1705 57.2538 94.9803 56.8377C94.7901 56.4196 94.4352 56.0818 94.0073 55.9179C93.5795 55.7509 93.0882 55.7594 92.6667 55.9417C92.2451 56.1204 91.8933 56.4684 91.7158 56.922C80.9048 84.519 73.8242 114.128 60.9182 140.295C61.9672 140.67 63.0196 141.044 64.0718 141.418C65.0956 136.924 66.2714 132.474 67.593 128.071C74.9271 103.58 86.3658 80.3705 99.9976 58.6687C100.555 57.7822 98.9865 56.7676 98.4065 57.6389Z" />
                    <path d="M118.587 85.0004C118.498 80.3261 118.41 75.6521 118.321 70.9778C118.314 70.7693 118.14 70.5791 117.931 70.5585C117.722 70.5293 117.509 70.6732 117.449 70.8938C116.936 72.862 114.964 77.5107 112.334 83.3114C109.7 89.1185 106.407 96.1061 103.221 102.851C100.036 109.596 96.965 116.098 94.7401 120.926C93.6244 123.341 92.7242 125.335 92.1157 126.742C91.8114 127.448 91.5801 128.002 91.428 128.416C91.3487 128.627 91.2917 128.793 91.241 128.987C91.2156 129.093 91.1871 129.187 91.1776 129.428C91.1839 129.557 91.1649 129.729 91.3139 130.079C91.39 130.25 91.5326 130.479 91.7893 130.665C92.0397 130.854 92.382 130.951 92.6419 130.948C93.0254 130.952 93.3392 130.841 93.5769 130.718C93.821 130.593 94.0048 130.449 94.1727 130.298C94.5055 129.996 94.7749 129.656 95.0601 129.253C95.8081 128.176 96.6227 126.619 97.5672 124.618C98.5054 122.623 99.5577 120.2 100.695 117.477C102.977 112.033 105.614 105.39 108.375 98.6515C111.139 91.9142 114.026 85.0812 116.796 79.2849C118.181 76.3874 119.535 73.7495 120.821 71.5223C122.105 69.2961 123.328 67.4781 124.397 66.2509C123.436 65.7438 122.479 65.2367 121.519 64.7296C118.482 76.067 112.816 86.6599 106.914 97.346C101.022 108.033 94.8986 118.809 91.0952 130.576C90.8417 131.358 91.184 132.246 91.8718 132.64C92.5469 133.058 93.4914 132.938 94.0587 132.343C102.293 123.734 107.884 112.791 113.342 101.82C118.787 90.842 124.099 79.8266 131.518 70.9876C130.491 70.3981 129.468 69.8086 128.441 69.2191C125.154 78.3683 120.216 86.7439 114.986 95.0919C109.757 103.441 104.239 111.757 99.8747 120.82C98.8192 123.013 97.8303 125.25 96.9333 127.542C96.759 127.989 96.7718 128.47 96.9429 128.885C97.1141 129.301 97.4436 129.648 97.8493 129.837C98.255 130.029 98.7337 130.061 99.1615 129.924C99.5894 129.79 99.9697 129.493 100.201 129.073C111.361 108.791 122.308 86.5468 137.306 69.233C136.285 68.7357 135.265 68.2388 134.244 67.7415C131.629 81.3717 124.229 93.9424 116.492 106.542C110.511 116.29 104.546 126.205 100.613 136.579C100.223 137.609 102.014 138.342 102.458 137.334C106.832 127.409 113.193 117.994 119.275 108.265C127.119 95.6992 134.862 82.8572 137.705 68.4137C137.857 67.6356 137.442 66.8208 136.748 66.4953C136.067 66.1466 135.17 66.319 134.643 66.9222C119.177 84.6796 108.15 107.155 97.0347 127.329C98.1218 127.84 99.2122 128.35 100.299 128.86C101.158 126.663 102.109 124.509 103.13 122.388C107.348 113.62 112.784 105.41 118.048 97.0101C123.306 88.6091 128.396 80.0123 131.835 70.4387C132.13 69.6197 131.772 68.667 131.037 68.2644C130.317 67.8328 129.312 68.0039 128.755 68.6701C120.945 77.9988 115.56 89.2763 110.128 100.226C104.705 111.182 99.2344 121.8 91.4977 129.896C92.4866 130.485 93.4754 131.074 94.4643 131.663C98.0965 120.349 104.065 109.74 109.95 99.0144C115.826 88.2881 121.617 77.4413 124.748 65.5885C124.945 64.8348 124.577 64.0158 123.908 63.6801C123.256 63.3207 122.371 63.4814 121.867 64.0671C120.584 65.5634 119.291 67.5304 117.95 69.8717C116.612 72.2117 115.237 74.9238 113.839 77.8802C111.05 83.7919 108.179 90.6832 105.443 97.4592C102.711 104.234 100.116 110.893 97.8874 116.311C96.7749 119.019 95.7512 121.418 94.8574 123.355C93.9668 125.288 93.187 126.777 92.6355 127.577C92.439 127.872 92.2678 128.068 92.2013 128.127C92.1918 128.135 92.1856 128.14 92.1824 128.143C92.1792 128.146 92.1823 128.145 92.1791 128.146C92.1855 128.144 92.1981 128.133 92.233 128.116C92.2964 128.085 92.4454 128.02 92.6736 128.022C92.9272 128.019 93.2663 128.114 93.5104 128.3C93.7639 128.483 93.9033 128.707 93.9762 128.872C94.1188 129.21 94.0966 129.364 94.1029 129.468C94.0966 129.661 94.0777 129.682 94.0777 129.692C94.0777 129.69 94.0809 129.687 94.0841 129.673C94.0872 129.66 94.0935 129.64 94.0999 129.616C94.1157 129.567 94.1379 129.499 94.1664 129.418C94.2837 129.091 94.496 128.557 94.7813 127.871C95.3518 126.495 96.2171 124.496 97.282 122.069C99.4087 117.214 102.318 110.635 105.285 103.785C108.255 96.9359 111.281 89.8164 113.678 83.8876C116.077 77.9531 117.842 73.2376 118.308 71.0989C118.02 71.0707 117.728 71.0428 117.44 71.0146C117.738 75.68 118.039 80.3454 118.34 85.0109C118.346 85.1481 118.59 85.1379 118.587 85.0004Z" />
                    <path d="M147.145 84.7963C142.556 95.8228 136.455 105.986 131.298 116.831C131.713 116.938 132.128 117.045 132.543 117.153C133.253 106.74 137.494 97.3831 143.586 88.9406C143.136 88.7818 142.686 88.6234 142.239 88.4646C141.839 95.0475 139.165 101.345 136.074 107.637C132.99 113.93 129.498 120.204 127.567 126.796C127.441 127.234 127.704 127.723 128.128 127.846C128.55 127.991 129.044 127.743 129.197 127.307C134.284 112.456 140.347 97.4427 147.906 83.7142C148.153 83.2645 147.985 82.6626 147.545 82.4246C147.12 82.1643 146.514 82.3181 146.245 82.7608C139.339 94.2079 131.333 105.046 123.473 115.929C124.072 116.242 124.667 116.554 125.263 116.867C129.466 105.048 135.497 91.9025 143.224 82.158C142.606 81.8604 141.988 81.5631 141.367 81.2655C139.808 88.0167 137.627 94.5696 134.6 100.656C131.982 105.915 128.791 110.858 124.823 115.348C125.295 115.685 125.77 116.023 126.243 116.36C130.002 109.089 133.694 101.782 137.383 94.4751C137.52 94.2048 137.054 93.9525 136.901 94.2146C132.813 101.306 128.721 108.397 124.696 115.524C124.487 115.894 124.598 116.403 124.946 116.649C125.282 116.909 125.802 116.868 126.116 116.537C130.376 112.067 133.802 107.016 136.499 101.6C139.618 95.3334 141.843 88.6205 143.424 81.7403C143.535 81.2601 143.285 80.7486 142.854 80.5511C142.429 80.3384 141.874 80.462 141.57 80.8478C133.621 90.9035 127.564 104.225 123.339 116.185C123.171 116.662 123.393 117.215 123.828 117.431C124.255 117.666 124.835 117.532 125.13 117.123C132.955 106.232 140.962 95.3229 147.887 83.7472C147.335 83.4293 146.781 83.1117 146.226 82.7938C138.645 96.689 132.616 111.822 127.58 126.759C128.122 126.929 128.664 127.1 129.206 127.27C131.022 120.923 134.433 114.693 137.513 108.337C140.588 101.981 143.335 95.4855 143.722 88.5505C143.741 88.2186 143.529 87.9068 143.228 87.8063C142.93 87.6963 142.568 87.8066 142.375 88.0744C136.223 96.7032 131.906 106.344 131.238 117.067C131.219 117.381 131.434 117.675 131.729 117.743C132.017 117.824 132.35 117.67 132.48 117.389C137.532 106.589 143.592 96.3648 148.156 85.214C148.384 84.6546 147.376 84.2384 147.145 84.7963Z" />
                    <path d="M85.6047 46.827C64.0651 49.9001 40.0344 55.3252 19.658 63.3443C19.0527 63.582 18.6976 64.2716 18.8561 64.8868C18.9892 65.508 19.6136 65.9676 20.2792 65.9106C23.1 65.6678 25.8637 65.2234 28.5767 64.6345C38.1833 62.5475 47.1942 58.7061 56.2176 55.5915C65.2442 52.4693 74.2549 50.0801 83.9059 50.6861C83.6682 49.6529 83.4304 48.62 83.1895 47.587C75.342 51.9666 66.7781 54.6714 58.078 57.3759C49.3842 60.0845 40.5541 62.7899 32.2533 67.2861C31.8381 67.5111 31.5403 67.8816 31.3977 68.3035C31.2519 68.7244 31.2676 69.1982 31.4419 69.608C31.6131 70.0194 31.9396 70.3627 32.3422 70.5535C32.7415 70.7471 33.2169 70.7925 33.6765 70.6508C50.6013 65.4431 67.6593 59.0775 84.8092 56.1303C84.4035 54.9272 83.9947 53.7237 83.589 52.5206C75.06 56.9585 65.7418 60.0709 56.2936 63.0615C49.3747 65.2529 42.4052 67.4595 35.6701 70.1411C36.0916 71.2108 36.5131 72.2805 36.9346 73.3502C49.3589 67.9612 64.0302 63.93 77.624 62.4479C77.8997 62.4175 78.1059 62.1795 78.0868 61.9025C78.0647 61.6255 77.8269 61.421 77.548 61.4328C63.7672 62.0064 48.6108 65.0881 35.6224 70.1602C35.2104 70.3209 34.8745 70.6581 34.7002 71.0644C34.5196 71.4695 34.5068 71.9436 34.6621 72.3579C34.8174 72.7731 35.1376 73.1233 35.537 73.3122C35.9363 73.5042 36.4117 73.5385 36.8871 73.3692C43.5746 70.9925 50.5158 68.9646 57.4664 66.7644C66.9494 63.7591 76.4831 60.5821 85.3702 55.9401C85.8013 55.7154 86.1118 55.3515 86.2767 54.9322C86.4415 54.5135 86.4509 54.0369 86.3051 53.6112C86.1625 53.1846 85.8646 52.8128 85.4779 52.5808C85.0944 52.3466 84.6254 52.2477 84.15 52.3304C66.5183 55.4048 49.3494 61.9041 32.5893 67.1444C33.0647 68.2661 33.5371 69.3874 34.0125 70.5091C41.8632 66.198 50.4428 63.4904 59.1334 60.7273C67.8177 57.96 76.613 55.1354 84.8156 50.4757C85.4621 50.109 85.7885 49.3369 85.6174 48.6517C85.4653 47.961 84.8282 47.4162 84.0992 47.3766C73.7541 46.8143 64.325 49.4538 55.2034 52.7C46.0753 55.9544 37.2199 59.8221 27.9746 61.9278C25.363 62.5234 22.7228 62.9826 20.0319 63.2539C20.2379 64.1094 20.4471 64.9648 20.6531 65.8202C40.6428 57.6183 64.3757 51.4969 85.7568 47.7823C86.0135 47.7373 86.1848 47.4875 86.1436 47.2314C86.1024 46.9753 85.8646 46.7899 85.6047 46.827Z" />
                    <path d="M118.056 61.6465C91.3186 70.7916 63.0787 76.6656 36.1891 86.1356C29.1878 88.6024 22.2752 91.2973 15.5084 94.3368C14.8112 94.649 14.4024 95.4319 14.5387 96.1586C14.6496 96.8898 15.293 97.4949 16.0663 97.5621C33.736 99.1062 53.9698 93.3527 73.7947 85.8598C93.6101 78.3587 113.036 69.0716 128.823 63.3983C129.314 63.222 129.701 62.8683 129.926 62.4322C130.154 61.998 130.214 61.4792 130.09 61.0044C129.973 60.5287 129.672 60.1017 129.263 59.8288C128.857 59.5534 128.35 59.4279 127.827 59.5084C104.542 63.0997 80.4917 71.1466 57.2786 80.3127C41.6025 86.5032 26.31 93.2123 11.9143 99.4248C11.3914 99.6511 10.992 100.064 10.7796 100.555C10.5641 101.045 10.5356 101.615 10.7067 102.123C10.8747 102.632 11.2361 103.073 11.702 103.336C12.1647 103.602 12.7321 103.696 13.2931 103.563C32.7408 98.9424 52.0554 90.002 71.4588 82.5503C90.8653 75.0843 110.313 69.1321 129.913 70.1666C129.555 68.7553 129.193 67.3436 128.832 65.9319C101.933 82.4755 65.7252 91.9547 33.2891 99.8181C28.3954 101.006 23.5874 102.168 18.9125 103.318C19.3943 104.76 19.8759 106.201 20.3545 107.642C36.4648 100.652 54.1093 92.5448 72.2163 85.8041C90.3202 79.0623 108.903 73.7031 126.769 72.2005C130.401 71.8943 134.005 71.7475 137.564 71.778C137.241 70.7447 136.917 69.7118 136.594 68.6786C123.143 78.07 105.762 84.1981 87.5057 89.1878C69.2465 94.1844 50.1093 98.0755 33.0641 103.167C29.3083 104.287 25.6571 105.464 22.1327 106.719C21.5559 106.925 21.1057 107.339 20.849 107.849C20.5859 108.356 20.5258 108.962 20.6811 109.511C20.83 110.061 21.1945 110.549 21.6794 110.85C22.1612 111.155 22.7602 111.278 23.3561 111.158C43.4726 107.111 63.5003 99.8723 83.5027 93.3981C103.502 86.9194 123.469 81.2001 143.494 80.0892C143.551 80.0861 143.608 80.0829 143.665 80.0797C143.443 79.2037 143.221 78.3273 142.996 77.4513C124.826 86.6053 105.781 93.9977 87.6705 103.672C87.6388 103.69 87.6388 103.739 87.6515 103.768C87.6673 103.798 87.7054 103.826 87.7403 103.811C106.313 95.1108 125.634 88.7691 144.217 79.9399C144.79 79.6664 145.114 78.9783 144.952 78.3695C144.816 77.7552 144.217 77.2903 143.548 77.3115C143.488 77.3134 143.431 77.3153 143.37 77.3172C122.896 77.9904 102.491 83.3997 82.3015 89.5868C62.1089 95.7783 42.1255 102.743 22.4527 106.631C22.8616 108.11 23.2704 109.59 23.6761 111.07C27.1118 109.857 30.6934 108.711 34.3889 107.608C51.168 102.604 70.2544 98.4492 88.615 93.1185C106.976 87.7805 124.604 81.2993 138.553 71.469C139.161 71.0385 139.424 70.2379 139.199 69.5613C138.993 68.8779 138.321 68.3718 137.583 68.3696C133.913 68.3578 130.211 68.5207 126.484 68.8358C108.174 70.3875 89.2742 75.6095 70.8882 82.1503C52.5054 88.6921 34.6488 96.5688 18.548 103.44C18.0029 103.673 17.5845 104.104 17.3595 104.618C17.1313 105.13 17.1028 105.727 17.2803 106.259C17.4546 106.792 17.8349 107.254 18.323 107.529C18.8079 107.808 19.4006 107.905 19.9933 107.763C24.6651 106.643 29.4762 105.5 34.3793 104.311C66.8852 96.4106 103.454 86.9115 131.231 69.8307C132.087 69.3052 132.502 68.2444 132.249 67.3148C132.027 66.3776 131.152 65.6467 130.151 65.5956C109.448 64.5409 89.4137 70.8008 69.8423 78.3514C50.271 85.9162 31.1149 94.7967 12.2757 99.304C12.7353 100.684 13.1949 102.063 13.6544 103.442C28.0501 97.1887 43.2823 90.4593 58.8443 84.2605C81.8862 75.0796 105.657 67.0809 128.449 63.4946C128.116 62.1977 127.783 60.9011 127.45 59.6044C111.381 65.446 92.0316 74.7902 72.4445 82.3196C52.8668 89.8575 33.0641 95.5343 16.3485 94.1914C16.5355 95.2664 16.7192 96.3415 16.9062 97.4166C23.5462 94.3638 30.3478 91.6349 37.2572 89.1171C63.776 79.4544 91.8859 72.6661 118.414 62.6468C118.671 62.5498 118.76 62.231 118.671 61.9891C118.585 61.7476 118.316 61.5578 118.056 61.6465Z" />
                    <path d="M157.603 97.396C162.572 97.3434 167.545 97.2908 172.518 97.2372C172.502 96.7425 172.486 96.2474 172.471 95.7526C140.526 96.7865 97.3482 106.228 63.3749 121.345C53.3658 125.793 44.1427 130.697 36.2159 135.991C35.6264 136.384 35.3951 137.177 35.674 137.799C35.9275 138.432 36.6597 138.818 37.3506 138.667C78.639 129.69 121.874 111.317 158.981 91.4815C159.552 91.1766 159.856 90.5075 159.723 89.9015C159.606 89.2917 159.064 88.797 158.42 88.7415C138.529 87.0252 115.094 91.7379 92.2202 98.8723C69.3526 106.012 47.0523 115.596 29.5537 123.719C29.2083 123.879 28.9547 124.16 28.8279 124.49C28.698 124.818 28.698 125.196 28.8279 125.525C28.9547 125.854 29.2114 126.131 29.5284 126.285C29.8485 126.44 30.2257 126.475 30.5838 126.36C49.0934 120.417 67.7519 111.908 86.6767 105.03C105.601 98.1472 124.77 92.9043 144.269 93.3844C144.006 92.5531 143.739 91.7221 143.476 90.8907C130.092 100.861 113.078 106.516 95.529 111.581C77.9798 116.654 59.914 121.137 44.428 128.983C44.8939 129.76 45.3567 130.536 45.8195 131.312C56.3674 123.965 71.8373 116.607 88.5657 110.675C105.294 104.739 123.3 100.216 138.935 98.4594C145.863 97.6832 152.329 97.4689 157.983 97.9072C157.679 97.1146 157.378 96.3219 157.073 95.5292C146.167 106.726 131.15 113.731 114.606 118.901C98.0646 124.075 80.0146 127.422 63.0897 131.443C52.0378 134.07 41.4645 136.982 32.102 140.836C31.6329 141.029 31.2844 141.379 31.0942 141.799C30.8977 142.217 30.8659 142.708 31.0054 143.148C31.1385 143.59 31.4427 143.976 31.8389 144.212C32.2351 144.45 32.7201 144.542 33.1892 144.442C64.1547 137.857 93.041 126.335 122.878 117.72C137.971 113.36 153.276 109.68 169.12 107.594C168.905 106.728 168.686 105.862 168.468 104.995C134.875 117.423 97.5163 123.648 64.44 139.414C59.3657 141.835 54.4213 144.534 49.6386 147.54C49.03 147.923 48.7639 148.67 48.9762 149.299C49.1664 149.935 49.8161 150.391 50.4754 150.356C63.131 149.673 75.7486 146.126 87.6625 142.653C87.8527 142.597 87.951 142.389 87.9066 142.204C87.859 142.02 87.672 141.884 87.4787 141.926C75.3429 144.539 62.5984 147.129 50.3675 147.323C50.6496 148.262 50.9286 149.2 51.2075 150.139C56.0029 147.368 60.9027 144.833 65.8914 142.454C98.3625 126.945 135.569 120.282 169.412 107.521C170.052 107.279 170.423 106.559 170.246 105.926C170.1 105.285 169.431 104.829 168.759 104.922C152.747 107.144 137.344 110.931 122.181 115.31C92.2233 123.964 63.0802 134.679 32.4316 140.737C32.7929 141.939 33.1575 143.141 33.5188 144.343C42.6278 140.739 53.0457 137.976 64.0215 135.376C80.8291 131.394 98.9457 127.788 115.687 122.26C132.425 116.728 147.806 109.283 159.096 97.4813C159.482 97.0794 159.59 96.4851 159.397 95.997C159.21 95.5048 158.728 95.1403 158.186 95.1035C152.297 94.7042 145.686 94.9755 138.634 95.7736C122.72 97.5675 104.562 102.133 87.6593 108.124C70.7598 114.119 55.1312 121.526 44.2663 129.08C43.6863 129.484 43.512 130.315 43.8765 130.893C44.2124 131.489 45.027 131.728 45.6577 131.409C60.7538 123.755 78.6739 119.289 96.2897 114.214C113.902 109.129 131.226 103.437 145.128 93.1115C145.603 92.7588 145.803 92.1217 145.622 91.5829C145.457 91.0394 144.928 90.6324 144.339 90.6178C124.289 90.1183 104.784 95.4798 85.7195 102.395C66.6553 109.316 48.0095 117.799 29.7155 123.655C30.0609 124.535 30.4032 125.416 30.7486 126.296C48.1869 118.213 70.3953 108.689 93.0791 101.623C115.76 94.5521 138.928 89.9614 158.167 91.6482C157.98 90.7348 157.793 89.8217 157.606 88.9082C120.663 108.637 77.6153 126.895 36.7231 135.775C37.1002 136.667 37.4806 137.56 37.8578 138.452C45.6071 133.279 54.6907 128.445 64.5794 124.052C98.1439 109.165 140.852 98.9383 172.534 97.2369C172.943 97.2147 173.273 96.8512 173.244 96.4629C173.238 96.0737 172.879 95.7397 172.486 95.752C167.517 95.9108 162.547 96.0702 157.577 96.23C157.254 96.2401 157.001 96.5035 157.007 96.8252C157.013 97.1469 157.279 97.3992 157.603 97.396Z" />
                    <path d="M147.458 136.214C121.402 141.136 92.5603 151.86 69.7783 165.637C69.2617 165.949 69.0525 166.634 69.3029 167.162C69.5279 167.7 70.1778 168.001 70.7578 167.824C99.5205 159.035 124.293 141.221 152.19 131.874C152.837 131.657 153.22 130.929 153.033 130.295C152.875 129.652 152.171 129.22 151.503 129.363C125.909 134.808 100.516 141.511 75.2996 148.342C75.7085 149.145 76.1141 149.947 76.523 150.749C83.22 145.404 91.9709 139.293 101.137 134.092C110.3 128.889 119.894 124.602 128.191 122.868C128.439 122.816 128.835 122.731 129.307 122.659C129.776 122.587 130.312 122.531 130.781 122.535C131.247 122.534 131.643 122.615 131.773 122.684C131.808 122.7 131.824 122.712 131.83 122.716C131.827 122.714 131.833 122.718 131.83 122.716C131.83 122.714 131.823 122.71 131.82 122.704C131.808 122.692 131.795 122.672 131.789 122.657C131.786 122.649 131.782 122.643 131.782 122.639C131.782 122.643 131.782 122.636 131.782 122.641C131.852 123.104 131.801 123.575 131.586 124.137C131.367 124.694 130.977 125.326 130.404 125.996C129.256 127.339 127.386 128.809 125.012 130.268C120.268 133.198 113.539 136.113 106.484 138.701C99.4253 141.291 92.0279 143.565 85.8792 145.275C82.8048 146.131 80.0442 146.845 77.7971 147.387C75.55 147.929 73.8067 148.3 72.821 148.463C73.1506 149.367 73.4772 150.272 73.8068 151.176C83.9586 145.222 97.0387 138.629 110.512 133.423C123.979 128.214 137.858 124.403 149.509 123.952C149.068 123.196 148.625 122.44 148.181 121.683C145.306 126.398 139.256 131.807 131.922 136.756C123.602 142.365 113.72 147.549 104.928 151.165C99.2733 153.518 94.0818 155.31 89.8664 155.918C89.8379 155.923 89.8155 155.947 89.8187 155.976C89.8219 156.005 89.8441 156.026 89.8758 156.026C94.1451 156.027 99.7012 155.044 105.647 153.12C114.873 150.091 125.073 145.007 133.592 139.228C141.126 134.124 147.417 128.606 150.723 123.242C151.014 122.77 151.011 122.165 150.739 121.71C150.476 121.248 149.95 120.95 149.395 120.972C137.199 121.459 123.098 125.375 109.441 130.657C95.79 135.943 82.5987 142.605 72.3202 148.645C71.7117 149.002 71.4392 149.778 71.6832 150.411C71.9019 151.054 72.6087 151.474 73.3028 151.359C74.4247 151.171 76.1965 150.79 78.4848 150.236C80.77 149.682 83.5623 148.957 86.6652 148.091C92.871 146.357 100.329 144.056 107.485 141.422C114.642 138.784 121.485 135.825 126.524 132.714C129.044 131.152 131.12 129.559 132.578 127.858C133.307 127.006 133.884 126.12 134.251 125.172C134.619 124.228 134.768 123.207 134.606 122.195C134.53 121.708 134.318 121.232 134.01 120.87C133.703 120.505 133.329 120.255 132.961 120.088C132.223 119.758 131.497 119.692 130.8 119.682C130.106 119.678 129.44 119.754 128.873 119.841C128.312 119.927 127.846 120.029 127.605 120.08C118.838 121.935 109.067 126.352 99.7519 131.654C90.44 136.957 81.6035 143.151 74.8019 148.596C74.2916 149.003 74.1396 149.744 74.4344 150.297C74.7069 150.861 75.3979 151.173 76.0254 151.002C101.216 144.131 126.55 137.392 152.048 131.913C151.816 131.076 151.588 130.239 151.357 129.402C122.993 139.012 98.2971 156.851 70.051 165.515C70.3774 166.244 70.7038 166.972 71.0303 167.701C93.4827 154.047 122.112 143.321 147.874 138.398C148.466 138.285 148.831 137.687 148.72 137.106C148.609 136.524 148.051 136.101 147.458 136.214Z" />
                </motion.svg> */}
                {/* <motion.svg
                    variants={slideLeft}
                    {...mountAnim}
                    onClick={() => {
                        closeMenu()
                    }}
                    width={64}
                    height={64}
                    viewBox="0 0 68 68"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 cursor-pointer transition-colors duration-500 md:h-24 md:w-24 hover:[&>path]:stroke-[#D3FD50]"
                >
                    <path d="M1.5 1.5L67 67" stroke="white" />
                    <path d="M66.5 1L0.999997 66.5" stroke="white" />
                </motion.svg> */}
            </div>

            <div className="flex h-fit w-full flex-col items-center justify-center">
                {menu.map((el, index) => {
                    return (
                        <Link
                            data={el}
                            index={index}
                            key={index}
                            closeMenu={closeMenu}
                        />
                    )
                })}
            </div>

            <motion.div
                variants={opacity}
                {...mountAnim}
                custom={0.75}
                className="z-20 flex cursor-pointer justify-center gap-4 p-5 text-[3vw] text-white md:gap-6"
            >
                <FaGithub className="duration-300 hover:text-[#D3FD50]" />
                <FaLinkedin className="duration-300 hover:text-[#D3FD50]" />
                <FaBehance className="duration-300 hover:text-[#D3FD50]" />
                <FaDribbble className="duration-300 hover:text-[#D3FD50]" />
            </motion.div>
        </div>
    )
}

export default Menu
