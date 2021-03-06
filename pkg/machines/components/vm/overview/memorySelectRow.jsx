/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2018 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import cockpit from 'cockpit';
import {
    FormHelperText,
    FormSelect, FormSelectOption,
} from '@patternfly/react-core';
import { Slider } from 'patternfly-react';

import { digitFilter, units } from "../../../helpers.js";

import './memorySelectRow.css';

const _ = cockpit.gettext;

class MemorySelectRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { memory: props.value };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.memory && !prevState.inputHasFocus)
            return { memory: parseFloat(nextProps.value).toFixed(0) };
        return null;
    }

    render() {
        const { id, value, minValue, maxValue, initialUnit, onValueChange, onUnitChange, readOnly, helperText } = this.props;
        /* We have the weird key attribute in the Slider because of
         * https://github.com/patternfly/patternfly-react/issues/3186
         * https://github.com/patternfly/patternfly-react/issues/3179
         * We have the focus callback in the Slider because of
         * https://github.com/patternfly/patternfly-react/issues/3191
         */
        return (
            <>
                <div className={'slider-input-group' + (readOnly ? ' disabled' : '')}
                     key={[id, "slider", minValue, maxValue].join("-")}>
                    { (minValue != undefined && maxValue != undefined && value >= minValue) ? <Slider id={id + "-slider"}
                        type="range"
                        min={minValue}
                        max={maxValue}
                        value={value}
                        showBoundaries
                        title={value}
                        ref={slider => { this.slider = slider }}
                        focus={() => { this.slider.current.focus() }}
                        onSlide={onValueChange} /> : null}
                    <div role="group" className="form-group">
                        <input id={id} className="form-control"
                            type="text" inputMode="numeric" pattern="[0-9]*"
                            min={minValue}
                            max={maxValue}
                            value={this.state.memory}
                            onKeyPress={digitFilter}
                            step={1}
                            disabled={readOnly}
                            onFocus={ () => this.setState({ inputHasFocus: true }) }
                            onBlur={e => { onValueChange(e.target.value); this.setState({ inputHasFocus: false }) } }
                            onClick={e => onValueChange(e.target.value)}
                            onChange={e => this.setState({ memory: e.target.value })} />
                        <FormSelect id={id + "-unit-select"}
                                    value={initialUnit}
                                    isDisabled={readOnly}
                                    onChange={onUnitChange}>
                            <FormSelectOption value={units.MiB.name} key={units.MiB.name}
                                              label={_("MiB")} />
                            <FormSelectOption value={units.GiB.name} key={units.GiB.name}
                                              label={_("GiB")} />
                        </FormSelect>
                    </div>
                </div>
                {helperText && <FormHelperText isHidden={false}>{helperText}</FormHelperText>}
            </>
        );
    }
}

export default MemorySelectRow;
