import React, { useRef, useState, useEffect } from 'react';
import classes from '../override/productFullDetail1.css'

const useContainerDimensions = myRef => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight
  })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions;
};

const GiftCardTemplate = props => {
	const { 
		templates, 
		amount,
		gcMessage,
		activeTemplate,
		setActiveTemplate
	} = props
	const currentTemplate = templates[activeTemplate]
	const {
		barcode,
		code,
		from,
		to,
		note,
		image,
		message,
		logo, 
		title,
		value
	} = JSON.parse(currentTemplate.design)

	const imagesContainer = useRef()
	const { width } = useContainerDimensions(imagesContainer)
    let matches = JSON.parse(currentTemplate.card).css.height.match(/(\d+)/); 
    const height = matches[0]
    const scale = 350/height
    const translateGiftcard = `-${((height - 350)/height)*50}%`

	const [translateOwlStage, setTranslateOwlStage] = useState(0);

	const itemWidth = ((width+75)/2 - 20)/3
	const owlStageStep = itemWidth + 10

	const prevTemplateImage = () => {
		setTranslateOwlStage(translateOwlStage - owlStageStep)
	}

	const nextTemplateImage = () => {
		setTranslateOwlStage(translateOwlStage + owlStageStep)
	}

	useEffect(() => {
		setTranslateOwlStage((width-75)*0.5-5)
	}, [])

	const templateBtns = (
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

	const templateChooseImages = (
		<div 
			className={classes['giftcard-template-choose-images']} 
			style={{height: !currentTemplate.images.length ? '0px' : 'unset'}}
			ref={imagesContainer}
		>
			<div className={classes['owl-stage-outer']}>
				<div 
					className={classes['owl-stage']}
					style={{transform: `translateX(${translateOwlStage}px)`}}
				>
					{currentTemplate.images.map((image,i) => {
						return (
							<div 
								className={classes['owl-item']}
								style={{width: `${itemWidth}px`}}
							>
								<div className={classes.image}>
									<div className={classes['template-image-wrapper']}>
										<img className={classes['template-image']} src={image.src} alt={image.alt} />
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
			{currentTemplate.images.length > 3 && 
				<div className={classes['owl-nav']}>
					<button 
						type="button" 
						role="presentation" 
						className={classes["owl-prev"]}
						onClick={prevTemplateImage}
					><i className="fa fa-chevron-left"></i></button>
					<button 
						type="button" 
						role="presentation" 
						className={classes["owl-next"]} 
						onClick={nextTemplateImage}
					><i className="fa fa-chevron-right"></i></button>
				</div>
			}
		</div>
	)
	
	return (
		<div className={classes["giftcard-template-container"]} id="giftcard-template-container">
			<link href="https://use.fontawesome.com/releases/v5.0.2/css/all.css" rel="stylesheet"/>
			<div className={classes['giftcard-template-container-preview']}>
				<div className={classes['giftcard-template-preview']} 
					 style={{
					 	// fontFamily: currentTemplate.font,
					 	transform: `scale(${scale})`
					 }}>
					<div className={classes['preview-giftcard']} style={{...JSON.parse(currentTemplate.card).css, ...{transform: `translateY(${translateGiftcard}`}}} >
						{ (currentTemplate.images.length != 0) && 
							<div id={classes['preview-giftcard-image']} style={image.css} >
								<img src={image.src} alt={image.key}/>
							</div>
						}
						<div id={classes['preview-giftcard-message']} style={message.css}>
							<span>
								<span></span>
		                        <span>{gcMessage}</span>
		                    </span>
						</div>
						<div id={classes['preview-giftcard-value']} style={value.css}>
							<span>
		                        <span></span>
		                        <span>${amount}</span>
		                    </span>
						</div>
						<div id={classes['preview-giftcard-title']} style={title.css}>
							<span>
		                        <span>{currentTemplate.title}</span>
		                        <span></span>
		                    </span>
						</div>
						{ logo &&
							 <div id={classes['preview-giftcard-logo']} style={logo.css}>
								<img src={logo.src}/>
							</div>
						}
						{ barcode &&
							<div id={classes['preview-giftcard-barcode']} style={barcode.css}>
								<img src='https://mp.pwa-commerce.com/static/version1611124918/frontend/Magento/luma/en_US/Mageplaza_GiftCard/images/barcode.png'/>
							</div>
						}
						{ note &&
							<div id={classes['preview-giftcard-note']} style={note.css}>
								<span>
									<span>{note.label}</span>
									<span></span>
								</span>
							</div>
						}
						{ from && 
							<div id={classes['preview-giftcard-from']} style={from.css}>
								<span>
									<span>From: </span>
									<span></span>
								</span>
							</div>
						}
						{ to &&
							<div id={classes['preview-giftcard-to']} style={to.css}>
								<span>
									<span>To: </span>
									<span></span>
								</span>
							</div>
						}
					</div>
				</div>
			</div>
			<div className={classes['template-selections-container']}>
				<div className={classes['block-title']}>
					<span>Gift card design</span>
				</div>
				{templateBtns}
				{templateChooseImages}
			</div>
		</div>
	)
}

export default GiftCardTemplate;