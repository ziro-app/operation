import React from 'react';

            export const conditionalBlocks = (howMuchImages,actualCardCollection,whichDocumentType,whichDocumentF,whichDocumentV) => {
                console.log('howMuchImages',howMuchImages,'actualCardCollection',actualCardCollection,'whichDocumentType',whichDocumentType,'whichDocumentF',whichDocumentF,'whichDocumentV',whichDocumentV)
                return howMuchImages === 2 ? [
                    {
                      title: 'Probabilidade doc 1',
                      content: [`${(actualCardCollection[whichDocumentType].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
                    },
                    {
                      title: 'Probabilidade selfie',
                      content: [`${(actualCardCollection[whichDocumentType].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
                    },
                    {
                        title: 'Foto doc 1',
                        content: [
                          (
                            <label
                              style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '15px', fontWeight: 'bold' }}
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = actualCardCollection[whichDocumentType].url
                                link.setAttribute('rel', 'noopener noreferrer')
                                link.setAttribute('target', '_blank')
                                document.body.appendChild(link)
                                link.click()
                              }}
                            >
                              Ver
                            </label>
                          ) || '-',
                        ],
                      },
                      {
                        title: 'Selfie',
                        content: [
                          (
                            <label
                              style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '15px', fontWeight: 'bold' }}
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = actualCardCollection.selfie.url
                                link.setAttribute('rel', 'noopener noreferrer')
                                link.setAttribute('target', '_blank')
                                document.body.appendChild(link)
                                link.click()
                              }}
                            >
                              Ver
                            </label>
                          ) || '-',
                        ],
                      }
                ]
                : [
                    {
                      title: 'Probabilidade doc 1',
                      content: [`${(actualCardCollection[whichDocumentF].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
                    },
                    {
                      title: 'Probabilidade doc 2',
                      content: [`${(actualCardCollection[whichDocumentV].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
                    },
                    {
                      title: 'Probabilidade selfie',
                      content: [`${(actualCardCollection[whichDocumentF].fileInfo.classifiedAs.probability * 100).toFixed(2)} %` || '-'],
                    },
                    {
                      title: 'Foto doc 1',
                      content: [
                        (
                          <label
                            style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = actualCardCollection[whichDocumentF].url
                              link.setAttribute('rel', 'noopener noreferrer')
                              link.setAttribute('target', '_blank')
                              document.body.appendChild(link)
                              link.click()
                            }}
                          >
                            Ver
                          </label>
                        ) || '-',
                      ],
                    },
                    {
                      title: 'Foto doc 2',
                      content: [
                        (
                          <label
                            style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = actualCardCollection[whichDocumentV].url
                              link.setAttribute('rel', 'noopener noreferrer')
                              link.setAttribute('target', '_blank')
                              document.body.appendChild(link)
                              link.click()
                            }}
                          >
                            Ver
                          </label>
                        ) || '-',
                      ],
                    },
                    {
                      title: 'Selfie',
                      content: [
                        (
                          <label
                            style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '15px', fontWeight: 'bold' }}
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = actualCardCollection.selfie.url
                              link.setAttribute('rel', 'noopener noreferrer')
                              link.setAttribute('target', '_blank')
                              document.body.appendChild(link)
                              link.click()
                            }}
                          >
                            Ver
                          </label>
                        ) || '-',
                      ],
                    }]
            }
export default conditionalBlocks
