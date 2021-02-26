import React from 'react';
import classes from '../../override/GiftCard.css'

const SettingSelectButton = props => {
	const {
		templates,
		activeTemplate,
		setActiveTemplate
	} = props
	return (
		<div className={classes['giftcard-template-setting-select']}>
			{
				templates.map((template, i) => {
					let active = '';
					if(activeTemplate === i) {
						active = classes.active
					}
					return (
						<div 
							className={classes["giftcard-design-button-container"] + ' ' + active} 
							id={classes[`giftcard-design-button-${i+1}`]}
							onClick={() => setActiveTemplate(i)}
						>
	                        <button type="button" className={classes["giftcard-design-button"]}>
	                            <span>{template.name}</span>
	                        </button>
	                    </div>
					)
				})
			}
		</div>
	)
}

export default SettingSelectButton