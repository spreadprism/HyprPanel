import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import icons from 'src/lib/icons/icons';
import { RowProps } from 'src/lib/options/types';
import { isPrimaryClick } from 'src/lib/events/mouse';

export const ResetButton = <T extends string | number | boolean | object>({
    ...props
}: RowProps<T>): JSX.Element => {
    return (
        <button
            className={'reset-options'}
            onClick={(_, event) => {
                if (isPrimaryClick(event)) {
                    props.opt.reset();
                }
            }}
            sensitive={bind(props.opt).as((v) => v !== props.opt.initial)}
            valign={Gtk.Align.START}
        >
            <icon icon={icons.ui.refresh} />
        </button>
    );
};
