const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/Widget', 'Widget.jsx'),
    output: {
        path: path.resolve(__dirname, 'build/dist'),
        filename: 'Widget.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /.tsx?$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        noEmit: false,
                    },
                },
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /.(gif|svg|jpg|png)$/,
                loader: 'file-loader',
            },
        ],
    },
};
