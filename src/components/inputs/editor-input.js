/**
 * Copyright 2017 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import RichTextEditor from 'react-rte-ref-fix';


export default class TextEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editorValue: RichTextEditor.createEmptyValue(),
            currentValue: null
        };

        this.handleChange = this.handleChange.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const {value} = props;
        const {editorValue, currentValue} = state;

        if (currentValue != null) {
            if (value === currentValue) {
                return state;
            }
        }

        return {...state, editorValue: editorValue.setContentFromString(value, 'html'), currentValue: value}
    }

    handleChange(editorValue) {

        let oldEditorValue = this.state.editorValue;
        this.setState({editorValue});

        let oldContentState = oldEditorValue ? oldEditorValue.getEditorState().getCurrentContent() : null;
        let newContentState = editorValue.getEditorState().getCurrentContent();

        if (oldContentState !== newContentState) {
            let stringValue = editorValue.toString('html');
            stringValue = stringValue === '<p><br></p>' ? '' : stringValue;

            this.setState({currentValue: stringValue});

            if (stringValue !== this.props.value) {
                let ev = {target: {
                    id: this.props.id,
                    value: stringValue,
                    type: 'texteditor'
                }};

                this.props.onChange(ev);
            }
        }
    }

    render() {

        let {onChange, value, error, className, id, ...rest} = this.props;
        let has_error = ( this.props.hasOwnProperty('error') && error !== '' );
        let editor;

        return (
            <div>
                <RichTextEditor
                    id={id}
                    ref={inst => { editor = inst;}}
                    className={className + ' ' + (has_error ? 'error' : '')}
                    value={this.state.editorValue}
                    onChange={this.handleChange}
                />
                {has_error &&
                <p className="error-label">{error}</p>
                }
            </div>
        );

    }
}
