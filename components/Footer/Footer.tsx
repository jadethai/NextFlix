import { FaGithub, FaLinkedin } from 'react-icons/fa'

const links = [
    {
        icon: <FaGithub />,
        href: 'https://github.com/phamrachel17/Netflix-Recommendation-System',
    },
]

export const Footer = () => {
    return (
        <div className='xl:absolute mt-0.5 xl:mt-0 whitespace-nowrap xl:-rotate-90 origin-bottom-right -bottom-6 right-0.5 text-sm'>
          Made by UCSB Students
        </div>
    )
}