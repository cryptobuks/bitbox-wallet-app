/**
 * Copyright 2018 Shift Devices AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, h } from 'preact';
import { translate } from 'react-i18next';
import approve from '../../assets/icons/hold.png';
import reject from '../../assets/icons/tap.png';
import * as style from '../dialog/dialog.css';

@translate()
export default class WaitDialog extends Component {
    state = {
        active: false,
    }

    componentWillMount() {
        document.body.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidMount() {
        setTimeout(this.activate, 10);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = e => {
        // @ts-ignore (blur exists only on HTMLElements)
        document.activeElement.blur();
        e.preventDefault();
        e.stopPropagation();
    }

    activate = () => {
        this.setState({ active: true });
    }

    render({
        t,
        includeDefault,
        prequel,
        title,
        paired = false,
        lock = false,
        touchConfirm = true,
        children,
    }, {
        active,
    }) {
        const isActive = active ? style.active : '';
        const defaultContent = (
            <div class="flex flex-column flex-start">
                {
                    prequel && (
                        <p>{prequel}</p>
                    )
                }
                {
                    paired ? (
                        <div>
                            <p class={[style.confirmationLabel, touchConfirm && lock ? style.disabledLabel : ''].join(' ')}>
                                <span class={style.confirmationLabelNumber}>1.</span>
                                {t('confirm.infoWhenPaired')}
                            </p>
                            <p class={[style.confirmationLabel, !touchConfirm && lock ? style.disabledLabel : ''].join(' ')}>
                                <span class={style.confirmationLabelNumber}>2.</span>
                                {t('confirm.info')}
                            </p>
                        </div>
                    ) : (
                        <p class={[style.confirmationLabel, style.noStep].join(' ')}>
                            {t('confirm.info')}
                        </p>
                    )
                }
                {
                    touchConfirm && (
                        <div class={['flex flex-row flex-between flex-items-stretch', style.confirmationInstructions].join(' ')}>
                            <div class="flex flex-column flex-center flex-items-center">
                                <img class={style.image} src={reject} alt="Reject" />
                                <p class="text-bold">
                                    {t('confirm.abortInfo')}
                                    <span class="text-red">{t('confirm.abortInfoRedText')}</span>
                                </p>
                            </div>
                            <div class="flex flex-column flex-center flex-items-center">
                                <img class={style.image} src={approve} alt="Approve" />
                                <p class="text-bold">
                                    {t('confirm.approveInfo')}
                                    <span class="text-green">{t('confirm.approveInfoGreenText')}</span>
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        );
        return (
            <div class={[style.overlay, isActive].join(' ')} style="z-index: 10001; background-color: #ccc;">
                <div class={[style.modal, isActive].join(' ')}>
                    <h3 class={style.modalHeader}>{title}</h3>
                    {
                        (children.length > 0 && includeDefault) && defaultContent
                    }
                    {
                        children.length > 0 ? (
                            <div class="flex flex-column flex-start">
                                {children}
                            </div>
                        ) : defaultContent
                    }
                </div>
            </div>
        );
    }
}
