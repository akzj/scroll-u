
export interface ScrollBarRenderProps {
    height: number,
    top: number,
}

const DefaultScrollBar: React.FC<ScrollBarRenderProps> = ({
    height,
    top,
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                right: 4,
                top: 0,
                width: 6,
                height: '100%',
                background: '#eee',
                borderRadius: 3,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: `${height}px`,
                    top: `${top}px`,
                    background: '#007bff',
                    borderRadius: 3,
                    transition: 'top 0.2s ease-out',
                }}
            />
        </div>
    );
};

export {DefaultScrollBar}