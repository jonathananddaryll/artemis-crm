import styles from './Dropdown.module.scss';
import React, { useState } from 'react';

export default function Dropdown(props) {
  // For reusability, pass in the number of list items,
  // the label / header for the dropdown,
  // and the callback function to update the search type
  // elsewhere in your app.

  // There is technically a footer, but I haven't come up with a need yet.
  // Might add function for a button with a callback function prop.

  const { items, header, setSearchType } = props;

  // Styling state to determine if the items are visible
  const [menuHiding, setMenuHiding] = useState(true);
  const [menuHeader, setMenuHeader] = useState(header)
  // Make the dropdown menu visible (dropped down)
  function setVisible() {
    if (!menuHiding) {
    } else {
      setMenuHiding(false);
    }
  }

  // Make the menu hidden (hung up)
  function setHidden() {
    if (menuHiding) {

    } else {
      setMenuHiding(true);
    }
  }

  function chooseChoice(choice){
    setMenuHeader(choice)
  }

  return (
    <section
      className={styles.dropdownContainer}
      onMouseEnter={() => setVisible()}
      onMouseLeave={() => setHidden()}
    >
      <div tabIndex={0}
        className={
          menuHiding ? styles.menuHiddenHeader : styles.menuShownHeader
        }
      >
        {menuHeader}
      </div>
      {items.map(element => {
        return (
          <a
            tabIndex={0}
            className={
              menuHiding ? styles.menuHiddenItem : styles.menuShownItem
            }
            onClick={() => {
              chooseChoice(element)
              setSearchType(element);
            }}
            key={element}
          >
            {element}
          </a>
        );
      })}
      <div
        className={
          menuHiding ? styles.menuHiddenFooter : styles.menuShownFooter
        }
      ></div>
    </section>
  );
}
