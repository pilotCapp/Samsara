import React, { useState, useEffect, useRef } from "react";
import { render, screen, userEvent } from '@testing-library/react-native';

import SamsaraWheel from '../SamsaraWheel';
import {services} from "@/constants/services";

it(`renders correctly`, () => {
    const end_period = new Date();
	end_period.setDate(end_period.getDate() + 20);
	const init_services: string[] = [
		"paramount",
		"hulu",
		"youtube",
		"apple",
		"roku",
		"netflix",
		"prime",
		"disney",
		"hbo",
	];

	const [selected_services, setSelected_services] = useState(init_services);
	const [selected_service_data, setSelected_service_data] = useState(
		services[init_services[0].toLowerCase()]
	);


  const tree = render(<SamsaraWheel serviceUsestate={[selected_services, setSelected_services]}
    end_period={end_period}></SamsaraWheel>).toJSON();

  expect(tree).toMatchSnapshot();
});