<?php

namespace App\Repositories;

use App\City;

class CityRepository
{
	protected $city;

	public function __construct(City $city)
	{
		$this->city = $city;
	}

	public function createGeoJson(geometry)
	{
		return json_encode($geometry);
	}

}