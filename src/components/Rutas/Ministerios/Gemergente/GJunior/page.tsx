import { Layout } from '@/components/Loyout/Loyout'
import { MinisteriosContainer } from './Components/MinisteriosContainer';
import { ministeriosMock } from './data/ministerios-mocks';


export const GEmergente = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-background p-8">
                <h1 className="text-4xl font-bold text-center mb-8">Ministerios</h1>
                <MinisteriosContainer ministeriosData={ministeriosMock} />
            </div>
        </Layout>
    )
}
