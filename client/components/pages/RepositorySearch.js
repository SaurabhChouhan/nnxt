import React, {Component} from 'react'
import {WithContext as ReactTags} from 'react-tag-input';

class RepositorySearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedValue: 'All',
            type: ['All', 'Feature', 'Task'],
            tags: [],
            suggestions: this.props.estimation.technologies
        };
        this.props.estimation.technologies.map((f, i) => {
            this.state.tags.push({
                id: this.state.tags.length + 1,
                text: f
            });
        })
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleSelectChange(e) {
        this.setState({selectedValue: e.target.value});
    }

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        let tags = this.state.tags;
        if(!(tags.findIndex(f=> f.text.toLowerCase()===tag.toLowerCase())!=-1)){
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({tags: tags});
    }

    render() {
        const {tags, suggestions} = this.state;
        const {estimation} = this.props
        return (
            <div>
                <div className="col-md-12 RepositoryHeading RepositorySideHeight">
                    <div class="col-md-10">
                        <div className="dropdownoption">
                            <select className="form-control "
                                    onChange={this.handleSelectChange}>
                                {
                                    this.state.type.map((item, key) =>
                                        <option value={item} key={key}>{item}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-1 pad ">
                        <div className="backarrow">
                            <h5><img key="he_requested_delete" src="/images/go_button.png"
                                     onClick={() => {
                                         this.props.fetchRepositoryBasedOnDiffCriteria(this.state.tags, this.state.selectedValue)
                                     }}/></h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-11">
                    <ReactTags
                        classNames=
                            {{
                                tags: 'tagsClass',
                                tagInput: 'tagInputClass',
                                tagInputField: 'tagInputFieldClass',
                                selected: 'selectedClass',
                                tag: 'tagClass technologytagNew',
                                remove: 'removeClass',
                                suggestions: 'suggestionsClass',
                                activeSuggestion: 'activeSuggestionClass'
                            }}
                        tags={tags}
                        suggestions={suggestions}
                        autofocus={false}
                        placeholder="Repository"
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}/>
                </div>


                <div className="col-md-12">

                    {
                        Array.isArray(this.props.repository) && this.props.repository.map((f, i) =>
                            (f.isFeature) ?
                                [<div className="repository repositoryFeature">
                                    <div className="RepositoryHeading" key={i} onClick={()=>{this.props.showFeatureDetailPage(f)}}>
                                        <div>
                                            <div className="repositoryFeatureLable"></div>
                                            <h5>Feature: {f.name}</h5><i
                                            className="glyphicon glyphicon-option-vertical pull-right"></i><span
                                            className="pull-right">(04 HRS)</span></div>
                                    </div>
                                    <div className="RepositoryContent">
                                        <p>{f.description}</p>
                                    </div>
                                </div>]
                                :
                                [<div className="repository repositoryTask">
                                    <div className="RepositoryHeading" key={i} onClick={()=>{this.props.showTaskDetailPage(f)}}>
                                        <div>
                                            <div className="repositoryTaskLable"></div>
                                            <h5>Task: {f.name}</h5><i
                                            className="glyphicon glyphicon-option-vertical pull-right"></i><span
                                            className="pull-right">(04 HRS)</span></div>
                                    </div>
                                    <div className="RepositoryContent">
                                        <p>{f.description}</p>
                                    </div>
                                </div>]
                        )
                    }
                </div>
            </div>)
    }

}

export default RepositorySearch