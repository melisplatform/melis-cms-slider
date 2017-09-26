<?php 

return array(
	'plugins' => array(
		'microservice' => array(
			//Module Name
			'MelisCmsSlider' => array( 
				//MelisCmsSliderService.php
				'MelisCmsSliderService' => array(
					/**
					 * getSliderList method
					 * @param int Start
					 * @param int limit
					 * @param varchar order by
					 * @param varchar search
					 */
					'getSliderList' => array(
						'attributes' => array(
							'name'	=> 'microservice_form',
							'id'	=> 'microservice_form',
							'method'=> 'POST',
							'action'=> $_SERVER['REQUEST_URI'],
						),
						'hydrator' => 'Zend\Stdlib\Hydrator\ArraySerializable',
						'elements' => array(
							array(
								'spec' => array(
									'name' => 'start',
									'type' => 'Text',
									'options' => array(
										'label' => 'Start',
									),
									'attributes' => array(
										'id' => 'start',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter start',
									),
								),
							),
							array(
								'spec' => array(
									'name' => 'limit',
									'type' => 'Text',
									'options' => array(
										'label' => 'Limit',
									),
									'attributes' => array(
										'id' => 'start',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter limit',
									),
								),
							),
							array(
								'spec' => array(
									'name' => 'order',
									'type' => 'Text',
									'options' => array(
										'label' => 'Order',
									),
									'attributes' => array(
										'id' => 'order',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter order',
									),
								),
							),
							array(
								'spec' => array(
									'name' => 'search',
									'type' => 'Text',
									'options' => array(
										'label' => 'Search',
									),
									'attributes' => array(
										'id' => 'search',
										'value' => '',
										'class' => '',
										'placeholder' => 'Search',
									),
								),
							),
						),
						'input_filter' => array(
							'start' => array(
								'name' => 'start',
								'required' => false,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'options' => array(
											'message' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter start'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
							'limit' => array(
								'name' => 'limit',
								'required' => false,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'options' => array(
											'message' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter limit'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
							'order' => array(
								'name' => 'order',
								'required' => false,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'options' => array(
											'message' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter order'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
						),
					),
					/**
					 *  method getSlider
					 * 	@param $sliderId
					 * 	@param $status
					 */
					'getSlider' => array(
						'attributes' => array(
							'name' => 'microservice_form',
							'id'   => 'microservice_form',
							'method' => 'POST',
							'action' => $_SERVER['REQUEST_URI']
						),
						'hydrator' => 'Zend\Stdlib\Hydrator\ArraySerializable',
						'elements' => array(
							array(
								'spec' => array(
									'name' => 'sliderId',
									'type' => 'Text',
									'options' => array(
										'label' => 'Slider Id',
									),
									'attributes' => array(
										'id' => 'start',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter Slider Id',
									),
								),
							),
							array(
								'spec' => array(
									'name' => 'status',
									'type' => 'Text',
									'options' => array(
										'label' => 'status',
									),
									'attributes' => array(
										'id' => 'start',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter status',
									),
								),
							),
						),
						'input_filter' => array(
							'sliderId' => array(
								'name' => 'sliderId',
								'required' => true,
								'validators' => array(
									array(
										'name' => 'IsInt',
										'options' => array(
											'message' => array(
												\Zend\I18n\Validator\IsInt::INVALID => 'Slider Id must be an integer'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
							'status' => array(
								'name' => 'status',
								'required' => false,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'option' => array(
											'message' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter status'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
						),
					),
					/**
					 * 	method getSliderDetails
					 *	@param sliderDetailId
					 */
					'getSliderDetails' => array(
						'attributes' => array(
							'name' => 'microservice_form',
							'id' => 'microservice_form',
							'method' => 'POST',
							'action' => $_SERVER['REQUEST_URI']
						),
						'hydrator' => 'Zend\Stdlib\Hydrator\ArraySerializable',
						'elements' => array(
							array(
								'spec' => array(
									'name' => 'sliderDetailId',
									'type' => 'Text',
									'options' => array(
										'label' => 'Slider Detail Id'
									),
									'attributes' => array(
										'id' => 'sliderDetailId',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter Slider Detail Id',
									),
								),
							),
						),
						'input_filter' => array(
							'sliderDetailId' => array(
								'name' => 'sliderDetailId',
								'required' => true,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'option' => array(
											'messages' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter Silder Detail Id'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
						),
					),
					/**
					 *  method getSliderByPageId
					 * 	@param $pageId
					 * 	@param $status
					 */
					'getSliderByPageId' => array(
						'attributes' => array(
							'name' => 'microservice_form',
							'id'   => 'microservice_form',
							'method' => 'POST',
							'action' => $_SERVER['REQUEST_URI']
						),
						'hydrator' => 'Zend\Stdlib\Hydrator\ArraySerializable',
						'elements' => array(
							array(
								'spec' => array(
									'name' => 'pageId',
									'type' => 'Text',
									'options' => array(
										'label' => 'page Id',
									),
									'attributes' => array(
										'id' => 'pageId',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter page Id',
									),
								),
							),
							array(
								'spec' => array(
									'name' => 'status',
									'type' => 'Text',
									'options' => array(
										'label' => 'status',
									),
									'attributes' => array(
										'id' => 'status',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter status',
									),
								),
							),
						),
						'input_filter' => array(
							'pageId' => array(
								'name' => 'pageId',
								'required' => true,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'option' => array(
											'messages' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter pageId'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
							'sliderId' => array(
								'name' => 'status',
								'required' => false,
								'validators' => array(
									array(
										'name' => 'NotEmpty',
										'option' => array(
											'messages' => array(
												\Zend\Validator\NotEmpty::IS_EMPTY => 'Please enter status'
											),
										),
									),
								),
								'filters' => array(
									array('name' => 'StripTags'),
									array('name' => 'StringTrim')
								),
							),
						),
					),
				),
			),
		),
	),
);