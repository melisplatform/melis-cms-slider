<?php

/**
 * Melis Technology (http://www.melistechnology.com)
 *
 * @copyright Copyright (c) 2015 Melis Technology (http://www.melistechnology.com)
 *
 */

return [
	'plugins' => [
		'microservice' => [
			//Module Name
			'MelisCmsSlider' => [
				//MelisCmsSliderService.php
				'MelisCmsSliderService' => [
					/**
					 * getSliderList method
					 * @param int Start
					 * @param int limit
					 * @param varchar order by
					 * @param varchar search
					 */
					'getSliderList' => [
						'attributes' => [
							'name'	=> 'microservice_form',
							'id'	=> 'microservice_form',
							'method'=> 'POST',
							'action'=> $_SERVER['REQUEST_URI'],
						],
						'hydrator' => 'Laminas\Hydrator\ArraySerializable',
						'elements' => [
							[
								'spec' => [
									'name' => 'start',
									'type' => 'Text',
									'options' => [
										'label' => 'start',
									],
									'attributes' => [
										'id' => 'start',
										'value' => '',
										'class' => '',
										'placeholder' => '0',
										'data-type' => 'int'
									],
								],
							],
							[
								'spec' => [
									'name' => 'limit',
									'type' => 'Text',
									'options' => [
										'label' => 'limit',
									],
									'attributes' => [
										'id' => 'limit',
										'value' => '',
										'class' => '',
										'placeholder' => '5',
										'data-type' => 'int'
									],
								],
							],
							[
								'spec' => [
									'name' => 'order',
									'type' => 'Text',
									'options' => [
										'label' => 'order',
									],
									'attributes' => [
										'id' => 'order',
										'value' => '',
										'class' => '',
										'placeholder' => 'mcslide_id',
										'data-type' => 'string'
									],
								],
							],
							[
								'spec' => [
									'name' => 'search',
									'type' => 'Text',
									'options' => [
										'label' => 'search',
									],
									'attributes' => [
										'id' => 'search',
										'value' => '',
										'class' => '',
										'placeholder' => 'search',
										'data-type' => 'string'
									],
								],
							],
						],
						'input_filter' => [
							'start' => [
								'name' => 'start',
								'required' => false,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'options' => [
											'message' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter start'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
							'limit' => [
								'name' => 'limit',
								'required' => false,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'options' => [
											'message' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter limit'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
							'order' => [
								'name' => 'order',
								'required' => false,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'options' => [
											'message' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter order'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
						],
					],
					/**
					 *  method getSlider
					 * 	@param $sliderId
					 * 	@param $status
					 */
					'getSlider' => [
						'attributes' => [
							'name' => 'microservice_form',
							'id'   => 'microservice_form',
							'method' => 'POST',
							'action' => $_SERVER['REQUEST_URI']
						],
						'hydrator' => 'Laminas\Hydrator\ArraySerializable',
						'elements' => [
							[
								'spec' => [
									'name' => 'sliderId',
									'type' => 'Text',
									'options' => [
										'label' => 'sliderId',
									],
									'attributes' => [
										'id' => 'sliderId',
										'value' => '',
										'class' => '',
										'placeholder' => 'Enter sliderId',
										'data-type' => 'int'
									],
								],
							],
							[
								'spec' => [
									'name' => 'status',
									'type' => 'Text',
									'options' => [
										'label' => 'status',
									],
									'attributes' => [
										'id' => 'status',
										'value' => '',
										'class' => '',
										'placeholder' => '1',
										'data-type' => 'bool'
									],
								],
							],
						],
						'input_filter' => [
							'sliderId' => [
								'name' => 'sliderId',
								'required' => true,
								'validators' => [
									[
										'name' => 'IsInt',
										'options' => [
											'message' => [
												\Laminas\I18n\Validator\IsInt::INVALID => 'Slider Id must be an integer'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
							'status' => [
								'name' => 'status',
								'required' => false,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'option' => [
											'message' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter status'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
						],
					],
					/**
					 * 	method getSliderDetails
					 *	@param sliderDetailId
					 */
					'getSliderDetails' => [
						'attributes' => [
							'name' => 'microservice_form',
							'id' => 'microservice_form',
							'method' => 'POST',
							'action' => $_SERVER['REQUEST_URI']
						],
						'hydrator' => 'Laminas\Hydrator\ArraySerializable',
						'elements' => [
							[
								'spec' => [
									'name' => 'sliderDetailId',
									'type' => 'Text',
									'options' => [
										'label' => 'sliderDetailId'
									],
									'attributes' => [
										'id' => 'sliderDetailId',
										'value' => '',
										'class' => '',
										'placeholder' => '66',
										'data-type' => 'int'
									],
								],
							],
						],
						'input_filter' => [
							'sliderDetailId' => [
								'name' => 'sliderDetailId',
								'required' => true,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'option' => [
											'messages' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter sliderDetailId'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
						],
					],
					/**
					 *  method getSliderByPageId
					 * 	@param $pageId
					 * 	@param $status
					 */
					'getSliderByPageId' => [
						'attributes' => [
							'name' => 'microservice_form',
							'id'   => 'microservice_form',
							'method' => 'POST',
							'action' => $_SERVER['REQUEST_URI']
						],
						'hydrator' => 'Laminas\Hydrator\ArraySerializable',
						'elements' => [
							[
								'spec' => [
									'name' => 'pageId',
									'type' => 'Text',
									'options' => [
										'label' => 'pageId',
									],
									'attributes' => [
										'id' => 'pageId',
										'value' => '',
										'class' => '',
										'placeholder' => '1',
										'data-type' => 'int'
									],
								],
							],
							[
								'spec' => [
									'name' => 'status',
									'type' => 'Text',
									'options' => [
										'label' => 'status',
									],
									'attributes' => [
										'id' => 'status',
										'value' => '',
										'class' => '',
										'placeholder' => '1',
										'data-type' => 'bool'
									],
								],
							],
						],
						'input_filter' => [
							'pageId' => [
								'name' => 'pageId',
								'required' => true,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'option' => [
											'messages' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter pageId'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
							'sliderId' => [
								'name' => 'status',
								'required' => false,
								'validators' => [
									[
										'name' => 'NotEmpty',
										'option' => [
											'messages' => [
												\Laminas\Validator\NotEmpty::IS_EMPTY => 'Please enter status'
											],
										],
									],
								],
								'filters' => [
									['name' => 'StripTags'],
									['name' => 'StringTrim']
								],
							],
						],
					],
				],
			],
		],
	],
];