import styles from './Dropdown.module.css';
import React, { useState } from 'react';

export default function Dropdown (props) {

    const { items, header, setSearchType } = props;

    const [ menuHiding, setMenuHiding ] = useState(true);

    function setVisible () {
        if(!menuHiding){
        }else{
            setMenuHiding(false);
        }
    }

    function setHidden () {
        if(menuHiding){
        }else{
            setMenuHiding(true);
        }
    }

    function updateSearchType(type){
        setSearchType(type);
    }

return (
    <section 
        className={styles.dropdownContainer} 
        onMouseEnter={() => setVisible()}
        onMouseLeave={() => setHidden()}
    >
        <div 
            className={menuHiding? styles.menuHiddenHeader: styles.menuShownHeader} 
        >
        {header}
        </div>
        {
            items.map(element => {
                return (
                    <a 
                        className={menuHiding? styles.menuHiddenItem: styles.menuShownItem} 
                        onClick={() => {updateSearchType(element)}}
                        key={element}
                    >
                        {element}
                    </a>
                )
            })
        }
        <div className={menuHiding? styles.menuHiddenFooter: styles.menuShownFooter}></div>
    </section>
)};

