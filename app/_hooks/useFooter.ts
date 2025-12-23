import { useState } from "react"

export const useFooter = () => {
    const [isFooterMenuOpen, setIsFooterMenuOpen] = useState<boolean>(false);

    return {
        isFooterMenuOpen,
        setIsFooterMenuOpen
    }
}